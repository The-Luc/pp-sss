import { ImageElementObject, TextElementObject } from '../models/element';
import { getPagePrintSize, pxToIn } from './canvas';
import { getUniqueId } from './util';
import {
  CLASS_ROLE,
  DIGITAL_PAGE_SIZE,
  OBJECT_TYPE,
  PORTRAIT_ASSISTANT_PLACEMENT,
  PORTRAIT_IMAGE_MASK,
  PORTRAIT_NAME_DISPLAY,
  PORTRAIT_NAME_POSITION,
  PORTRAIT_SIZE,
  PORTRAIT_TEACHER_PLACEMENT
} from '@/common/constants';

import { cloneDeep } from 'lodash';
import { getActiveCanvas, ptToPx } from './canvas';
import { measureTextWidth } from './textSize';

/**
 * Get range of portrait
 *
 * @param   {Number}  maxPortrait   max portrait per page
 * @param   {Number}  totalPortrait total portrait
 * @param   {Number}  folderIdx index of selected folder
 * @param   {Number}  firstPage [optional] number of portraits in the first page (if specified)
 * @returns  array of min index & max index & folder index
 */
const getRangePortrait = (maxPortrait, totalPortrait, folderIdx, firstPage) => {
  const pageInfo = [];
  let count = 0;

  if (firstPage) {
    count = firstPage;
    pageInfo.push({ folderIdx, min: 0, max: firstPage - 1 });
  }

  while (count < totalPortrait) {
    const max = Math.min(count + maxPortrait, totalPortrait);

    pageInfo.push({ folderIdx, min: count, max: max - 1 });
    count = max;
  }

  return pageInfo;
};

/**
 * Get range of portrait for selected page
 * And hanlde large portrait size
 *
 * @param   {Number}  currentIndex  index of page in list of selected page
 * @param   {Number}  maxPortrait   max portrait per page
 * @param   {Number}  totalPortrait total portrait
 * @returns {Object}                min index & max index of protrait in folder
 */
export const getRangePortraitSingleFolder = (
  rows,
  cols,
  folder,
  teacherSettings
) => {
  const { isHasLargeTeacher } = isHasLargePortrait(teacherSettings);
  const maxPortrait = rows * cols;
  const { assetsCount, assets } = folder;
  const folderIdx = 0; //folder index is always 0 because there is only 1 folder

  if (!isHasLargeTeacher) {
    return getRangePortrait(maxPortrait, assetsCount, folderIdx);
  }

  // how many additional slots
  const extraSlots = calcAdditionPortraitSlot(teacherSettings, assets);

  // has teacher and first placement
  if (teacherSettings.teacherPlacement === PORTRAIT_TEACHER_PLACEMENT.FIRST) {
    // firstPage: number of portraits in the first page
    const firstPage = maxPortrait - extraSlots;

    return getRangePortrait(maxPortrait, assetsCount, folderIdx, firstPage);
  }

  // has teacher and last placment
  const numLargePortrait = extraSlots / 3;
  const portraitRange = getRangePortrait(maxPortrait, assetsCount, folderIdx);

  const lastPageIndex = portraitRange.length - 1;
  const portraitsOnLastPage = assetsCount % maxPortrait || maxPortrait;
  const isEnoughRow = maxPortrait - cols > portraitsOnLastPage;
  const { max } = portraitRange[lastPageIndex];

  if (!isEnoughRow) {
    portraitRange[lastPageIndex].max = max - numLargePortrait;
    portraitRange.push({ folderIdx, max, min: max - numLargePortrait + 1 });

    return portraitRange;
  }

  const isNextToLastRow = portraitsOnLastPage / rows > rows - 1;
  if (numLargePortrait === 2 && isNextToLastRow) {
    portraitRange[lastPageIndex].max = max - 1;
    portraitRange.push({ folderIdx, max, min: max });

    return portraitRange;
  }

  return portraitRange;
};

/**
 * Get range of portrait for selected page
 *
 * @param   {Number}  currentIndex  index of page in list of selected page
 * @param   {Number}  maxPortrait   max portrait per page
 * @param   {Array}   folders       selected portrait folders
 * @returns {Object}                min index & max index of protrait and folder index
 */
export const getRangePortraitMultiFolder = (
  maxPortrait,
  folders,
  isContinuousFlow
) => {
  if (isContinuousFlow) {
    const totalPortraits = folders.reduce((acc, p) => acc + p.assetsCount, 0);
    return getRangePortrait(maxPortrait, totalPortraits, 0);
  }

  const portraitInPages = [];

  folders.forEach(({ assetsCount }, idx) => {
    const portraitRange = getRangePortrait(maxPortrait, assetsCount, idx);
    portraitInPages.push(...portraitRange);
  });

  return portraitInPages;
};

/**
 * To caculate the number of slots need for large size portraits
 *
 * @param {Object} teacherSettings config for teacherSettings
 * @param {Array} portraits array of portrait in selected folder
 * @returns number of slots need for large size portraits
 */
export const calcAdditionPortraitSlot = (teacherSettings, portraits) => {
  if (!teacherSettings.hasTeacher) return 0;

  let numTeacher = 0;
  let numAssistant = 0;

  portraits.forEach(p => {
    if (p.classRole === CLASS_ROLE.PRIMARY_TEACHER) {
      numTeacher++;
    }
    if (p.classRole === CLASS_ROLE.ASSISTANT_TEACHER) {
      numAssistant++;
    }
  });

  const { isHasLargeTeacher, isHasLargeAsst } = isHasLargePortrait(
    teacherSettings
  );

  const teacherCount = isHasLargeTeacher ? numTeacher : 0;
  const asstCount = isHasLargeAsst ? numAssistant : 0;

  return (teacherCount + asstCount) * 3;
};

/**
 * Return the object show that whether settings contain large portraits
 * @param {Object} teacherSettings config of teacherSetitngs
 * @returns {Boolean, Boolean} whether setting contain portrait with large size
 */
const isHasLargePortrait = teacherSettings => {
  const {
    hasTeacher,
    hasAssistantTeacher,
    teacherPortraitSize,
    assistantTeacherPortraitSize,
    teacherPlacement
  } = teacherSettings;

  const isHasLargeTeacher =
    hasTeacher &&
    teacherPortraitSize === PORTRAIT_SIZE.LARGE &&
    teacherPlacement !== PORTRAIT_TEACHER_PLACEMENT.ALPHABETICAL;
  const isHasLargeAsst =
    hasAssistantTeacher && assistantTeacherPortraitSize === PORTRAIT_SIZE.LARGE;

  return { isHasLargeTeacher, isHasLargeAsst };
};

/**
 *  Callback function to  sort portraits by first name
 *
 * @param {Object} a portrait object will be sort
 * @param {Object} b portrait object will be sort
 * @returns value sort junction will consume
 */
export const sortPortraitByName = isFirstLast => {
  return (a, b) => {
    const first = isFirstLast ? 'firstName' : 'lastName';
    const last = isFirstLast ? 'lastName' : 'firstName';

    const nameA = (a[first] + a[last]).toUpperCase();
    const nameB = (b[first] + b[last]).toUpperCase();

    if (nameA === nameB) return 0;

    return nameA > nameB ? 1 : -1;
  };
};

/**
 *  sort portraits order
 *
 * @param {Object} teachers teacher portratis
 * @param {Array} asstTeachers assistant teacher portraits
 * @param {Array} students student portratis
 * @param {String} asstPlacement before or after teacher
 * @returns sorted order
 */
export const getTeacherAndAsstOrder = (
  teachers,
  asstTeachers,
  asstPlacement
) => {
  if (asstPlacement === PORTRAIT_ASSISTANT_PLACEMENT.BEFORE_TEACHERS) {
    return [...asstTeachers, ...teachers];
  }

  return [...teachers, ...asstTeachers];
};
/**
 *  To seperate portrait by role
 *
 * @param {Object} folder selected folder
 * @returns portrait groups by role
 */
export const getPortraitsByRole = folder => {
  const portraits = cloneDeep(folder.assets);

  const teachers = portraits.filter(
    p => p.classRole === CLASS_ROLE.PRIMARY_TEACHER
  );
  const asstTeachers = portraits.filter(
    p => p.classRole === CLASS_ROLE.ASSISTANT_TEACHER
  );
  const students = portraits.filter(p => p.classRole === CLASS_ROLE.STUDENT);

  return { students, teachers, asstTeachers };
};

export const getSelectedDataOfFolders = (
  pagesCurrent,
  startOnPageCurrent,
  folders,
  maxPortraitPerPage
) => {
  const selectedData = [];
  folders.forEach((element, index) => {
    const startOnPage = !index
      ? startOnPageCurrent
      : Math.max(selectedData[index - 1].endOnPage + 1, pagesCurrent[index]);
    const pages = getPagesOfFolder(
      element.assetsCount,
      startOnPage,
      maxPortraitPerPage
    );
    selectedData.push({
      startOnPage: pages[0],
      endOnPage: pages[pages.length - 1],
      requiredPages: pages
    });
  });

  return selectedData;
};

export const getPagesOfFolder = (
  totalPortraitsCount,
  startOnPageCurrent,
  maxPortraitPerPage
) => {
  const totalPage = Math.ceil(totalPortraitsCount / maxPortraitPerPage);

  return [...Array(totalPage).keys()].map(p => {
    return p + startOnPageCurrent;
  });
};

export const getSelectedDataOfPages = (pages, startOnPageNumber) => {
  const selectedData = [];

  pages.forEach((element, index) => {
    const page = !index
      ? startOnPageNumber
      : Math.max(selectedData[index - 1] + 1, element);

    selectedData.push(page);
  });

  return selectedData;
};

/**
 * Draw portrait images to canvas
 * @param settings flow settings for portraits
 * @param assets assets will be applied
 * @param isRight flag for right page of sheet
 * @param isFirstPage flag for first page will be applied
 * @param isDigital flag for digital edition
 * @return array image objects
 */
export const createPortraitObjects = (
  settings,
  assets,
  isRight,
  isFirstPage,
  isDigital
) => {
  const { colCount, rowCount, margins } = settings.layoutSettings;

  const {
    nameTextFontSettings,
    isPageTitleOn,
    nameDisplay,
    nameGap,
    nameLines,
    namePosition,
    nameWidth,
    pageTitle,
    pageTitleFontSettings,
    pageTitleMargins
  } = settings.textSettings;

  const {
    teacherPortraitSize,
    assistantTeacherPortraitSize,
    hasTeacher
  } = settings.teacherSettings;

  const { border, shadow, mask } = settings.imageSettings;

  const isNameOutSide = namePosition.value === PORTRAIT_NAME_POSITION.OUTSIDE;

  const digitalPageSize = {
    safeMargin: 0,
    pageWidth: DIGITAL_PAGE_SIZE.PDF_WIDTH,
    pageHeight: DIGITAL_PAGE_SIZE.PDF_HEIGHT,
    bleedLeft: 0,
    bleedTop: 0
  };

  const { safeMargin, pageWidth, pageHeight, bleedLeft, bleedTop } = isDigital
    ? digitalPageSize
    : getPagePrintSize().inches;

  const titleMeasureWidth =
    pxToIn(
      measureTextWidth(getActiveCanvas(), pageTitle, {
        fontSize: `${ptToPx(pageTitleFontSettings.fontSize)}px`,
        fontFamily: pageTitleFontSettings.fontFamily
      })
    ) +
    bleedLeft * 2;
  const titleLines = Math.ceil(
    titleMeasureWidth / (pageWidth - safeMargin * 2)
  );
  const titleHeight =
    pxToIn(ptToPx(pageTitleFontSettings.fontSize)) * titleLines;
  const textHeight = isNameOutSide
    ? 0
    : pxToIn(ptToPx(nameTextFontSettings.fontSize)) * nameLines;

  const offsetTitle = isFirstPage && isPageTitleOn ? titleHeight : 0;
  const offsetName = isNameOutSide ? nameWidth : 0;
  const offsetNameLeft = isRight ? 0 : offsetName;
  const offsetNameRight = isRight ? offsetName : 0;

  const offsetTop =
    (isFirstPage && isPageTitleOn
      ? pageTitleMargins.top + pageTitleMargins.bottom
      : margins.top) + offsetTitle;
  const offsetBottom = margins.bottom;
  const offsetRight = margins.right + offsetNameRight;
  const offsetLeft = margins.left + offsetNameLeft;

  const defaultGap = 0.15;
  const defaultTextGap = 0.05;
  const defaultTextPadding = 0.125;

  const totalHeight =
    pageHeight - offsetTop - offsetBottom - textHeight - defaultTextGap;
  const totalWidth = pageWidth - offsetLeft - offsetRight;

  const isSquareImage = [
    PORTRAIT_IMAGE_MASK.CIRCLE,
    PORTRAIT_IMAGE_MASK.SQUARE
  ].includes(mask);

  const objectType = [
    PORTRAIT_IMAGE_MASK.ROUNDED,
    PORTRAIT_IMAGE_MASK.CIRCLE,
    PORTRAIT_IMAGE_MASK.OVAL
  ].includes(mask)
    ? OBJECT_TYPE.PORTRAIT_IMAGE
    : OBJECT_TYPE.IMAGE;

  const imageRatio = isSquareImage ? 1 : 1.25;

  const isFirstLast = nameDisplay.value === PORTRAIT_NAME_DISPLAY.FIRST_LAST;

  const tmpHeight = totalHeight / rowCount - defaultGap - textHeight;
  const tmpWidth = totalWidth / colCount - defaultGap;

  const itemHeight = Math.min(tmpHeight, tmpWidth * imageRatio);
  const itemWidth = itemHeight / imageRatio;

  const colGap =
    colCount > 1 ? (totalWidth - itemWidth * colCount) / (colCount - 1) : 0;
  const rowGap =
    rowCount > 1 ? (totalHeight - itemHeight * rowCount) / (rowCount - 1) : 0;

  const borderOffset = border.showBorder
    ? pxToIn(ptToPx(border.strokeWidth))
    : 0;

  const largeTeacherHeight = Math.min(
    (itemWidth * 2 + colGap) * imageRatio,
    itemHeight * 2 + rowGap
  );
  const largeTeacherWidth = largeTeacherHeight / imageRatio;

  const hasLargeTeacher =
    hasTeacher && teacherPortraitSize === PORTRAIT_SIZE.LARGE;
  const hasLargeAstTeacher =
    hasTeacher && assistantTeacherPortraitSize === PORTRAIT_SIZE.LARGE;

  const objs = [];
  const splitAssets = [];

  while (assets.length) {
    splitAssets.push(assets.splice(0, colCount));
  }

  splitAssets.forEach((rowAssets, rowIndex) => {
    rowAssets.forEach(
      ({ lastName, firstName, imageUrl, classRole }, colIndex) => {
        if (!imageUrl) return;

        const isLargeAsst =
          (classRole === CLASS_ROLE.PRIMARY_TEACHER && hasLargeTeacher) ||
          (classRole === CLASS_ROLE.ASSISTANT_TEACHER && hasLargeAstTeacher);

        //image margin top and left
        const offsetX = isRight
          ? bleedLeft + pageWidth + margins.left
          : offsetLeft + bleedLeft;
        const offsetY = bleedTop + offsetTop;

        const x = colIndex * (itemWidth + colGap) + offsetX;
        const y = rowIndex * (itemHeight + rowGap) + offsetY;

        const nameSpace = `${nameLines > 1 ? '\n' : ' '}`;
        const value = isFirstLast
          ? `${firstName}${nameSpace}${lastName}`
          : `${lastName},${nameSpace}${firstName}`;
        const measureOptions = {
          fontSize: `${ptToPx(nameTextFontSettings.fontSize)}px`,
          fontFamily: nameTextFontSettings.fontFamily
        };

        const textWidth =
          pxToIn(measureTextWidth(getActiveCanvas(), value, measureOptions)) +
          defaultTextPadding * 2;

        const imageWidth = isLargeAsst ? largeTeacherWidth : itemWidth;
        const imageHeight = isLargeAsst ? largeTeacherHeight : itemHeight;

        const img = new ImageElementObject({
          id: getUniqueId(),
          imageUrl,
          originalUrl: imageUrl,
          coord: { x, y },
          size: {
            width: imageWidth - borderOffset,
            height: imageHeight - borderOffset
          },
          mask,
          border,
          shadow,
          hasImage: true,
          fromPortrait: true,
          type: objectType
        });

        const textX = isRight
          ? pageWidth + margins.left + bleedLeft + totalWidth
          : margins.left;
        const textY = y + colIndex * (nameGap + textHeight) - bleedTop;

        const text = new TextElementObject({
          id: getUniqueId(),
          text: value,
          coord: {
            x: isNameOutSide ? textX : x - defaultTextPadding,
            y: isNameOutSide
              ? textY
              : y + imageHeight - defaultTextPadding + defaultTextGap
          },
          size: {
            width: isNameOutSide
              ? Math.max(textWidth, nameWidth + defaultTextPadding)
              : Math.max(imageWidth + defaultTextPadding * 2, textWidth),
            height: isNameOutSide ? textHeight : rowGap
          },
          ...nameTextFontSettings
        });

        objs.push(img, text);
      }
    );
  });

  if (isPageTitleOn && isFirstPage) {
    const title = new TextElementObject({
      id: getUniqueId(),
      text: pageTitle,
      coord: {
        x: isRight ? pageTitleMargins.left + pageWidth : pageTitleMargins.left,
        y: pageTitleMargins.top
      },
      size: {
        width:
          pageWidth +
          bleedLeft * 2 -
          pageTitleMargins.left -
          pageTitleMargins.right,
        height: titleHeight
      },
      ...pageTitleFontSettings
    });

    objs.push(title);
  }

  return objs;
};

/**
 * Create page objects for render portraits
 * @param {*} settings flow settings for portraits
 * @param {*} requiredPages pages are required to render portraits
 * @param isDigital flag for digital edition
 * @returns page objects will be stored
 */
export const getPageObjects = (settings, requiredPages, isDigital) => {
  const { teacherSettings, folders, layoutSettings } = settings;
  const {
    teacherPortraitSize,
    assistantTeacherPortraitSize,
    hasTeacher
  } = teacherSettings;

  const { rowCount, colCount } = layoutSettings;
  const itemPerPage = rowCount * colCount;

  const portraitRange = getRangePortraitSingleFolder(
    rowCount,
    colCount,
    folders[0],
    teacherSettings
  );

  const hasLargeAsset =
    hasTeacher &&
    (teacherPortraitSize === PORTRAIT_SIZE.LARGE ||
      assistantTeacherPortraitSize === PORTRAIT_SIZE.LARGE);

  const totalAssets = folders.reduce((rs, p) => rs.concat(p.assets), []);
  const pageObjects = {};

  requiredPages.forEach((page, index) => {
    const { min, max } = portraitRange[index] || {};
    const assetsPerPage = hasLargeAsset ? max - min + 1 : itemPerPage;
    const assets = totalAssets.splice(0, assetsPerPage);
    const tmpAssets = [];

    const primaryTeacherIndex = assets.findIndex(
      asset =>
        hasTeacher &&
        asset.classRole === CLASS_ROLE.PRIMARY_TEACHER &&
        teacherPortraitSize === PORTRAIT_SIZE.LARGE
    );

    if (primaryTeacherIndex >= 0) {
      assets.splice(primaryTeacherIndex + 1, 0, {});
      tmpAssets.push({}, {});
    }

    const assistantTeacherIndex = assets.findIndex(
      asset =>
        hasTeacher &&
        asset.classRole === CLASS_ROLE.ASSISTANT_TEACHER &&
        assistantTeacherPortraitSize === PORTRAIT_SIZE.LARGE
    );

    if (assistantTeacherIndex >= 0) {
      assets.splice(assistantTeacherIndex + 1, 0, {});
      tmpAssets.push({}, {});
    }

    assets.splice(colCount, 0, ...tmpAssets);

    const isRightPage = !isDigital && page % 2;

    pageObjects[page] = createPortraitObjects(
      settings,
      assets,
      isRightPage,
      index === 0,
      isDigital
    );
  });

  return pageObjects;
};

export const getDataScreenOfMultiFolder = (
  screens,
  folders,
  maxPortraitPerPage
) => {
  let totalLast = 0;
  return Object.keys(screens).map(key => {
    const folder = screens[key].map((_, folderInd) => {
      return folders[totalLast + folderInd];
    });

    totalLast += screens[key].length;

    return {
      screen: parseInt(key),
      frames: getSelectedDataOfFolders(
        screens[key],
        screens[key][0],
        folder,
        maxPortraitPerPage
      )
    };
  });
};
