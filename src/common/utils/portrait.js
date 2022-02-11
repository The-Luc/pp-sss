import { ImageElementObject, TextElementObject } from '../models/element';
import { getUniqueId, getPageSize } from './util';
import {
  CLASS_ROLE,
  DEFAULT_LINE_HEIGHT,
  OBJECT_TYPE,
  PORTRAIT_ASSISTANT_PLACEMENT,
  PORTRAIT_FLOW_OPTION_MULTI,
  PORTRAIT_IMAGE_MASK,
  PORTRAIT_NAME_DISPLAY,
  PORTRAIT_NAME_POSITION,
  PORTRAIT_SIZE,
  PORTRAIT_TEACHER_PLACEMENT,
  TEXT_HORIZONTAL_ALIGN
} from '@/common/constants';

import { cloneDeep } from 'lodash';
import { getActiveCanvas, ptToPx, pxToIn } from './canvas';
import { measureTextWidth } from './textSize';
import { createTextBoxObject } from '@/common/fabricObjects';
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
  const { max } = portraitRange[lastPageIndex];
  const numVacantSlots = maxPortrait - portraitsOnLastPage;

  /*
    Based on number of vacant slots to decide wheter move large portrait to a new page/frame or not

    Number of slot required for 1 large portrait: a = cols + 1
    Number of slot required for 2 large portrait: b =cols + 2

    if numVacantSlots > b => can accomodate 2 large portrait
    if numVacantSlots > a => can accomodate 1 large portrait
  */

  // Special case, need to be check first
  // two large portarits: one on the last page, one on the near last page
  if (portraitsOnLastPage === 1 && numLargePortrait > 1) {
    portraitRange[lastPageIndex - 1].max -= 1;
    portraitRange[lastPageIndex].min -= 1;

    return portraitRange;
  }

  if (
    numVacantSlots >= cols + 2 ||
    (numVacantSlots >= cols + 1 && numLargePortrait === 1)
  ) {
    return portraitRange;
  }

  if (
    numVacantSlots >= cols + 1 ||
    (numVacantSlots >= cols && numLargePortrait === 2)
  ) {
    // move 1 large portrait to a new page
    portraitRange[lastPageIndex].max = max - 1;
    portraitRange.push({ folderIdx, max, min: max });

    return portraitRange;
  }

  // not enough row to add large portrats, so all large portraits is moved to the new page/frame
  portraitRange[lastPageIndex].max = max - numLargePortrait;
  portraitRange.push({ folderIdx, max, min: max - numLargePortrait + 1 });

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
export const sortPortraitByName = (a, b) => {
  const nameA = (a.lastName + a.firstName).toUpperCase();
  const nameB = (b.lastName + b.firstName).toUpperCase();

  if (nameA === nameB) return 0;

  return nameA > nameB ? 1 : -1;
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
  const totalPages = Math.ceil(totalPortraitsCount / maxPortraitPerPage);

  return [...Array(totalPages).keys()].map(p => {
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

  const isNameOutSide =
    namePosition.value === PORTRAIT_NAME_POSITION.OUTSIDE.value;

  const { pageWidth, pageHeight, bleedLeft, bleedTop } = getPageSize(isDigital);

  const isTextAlignRight =
    nameTextFontSettings?.alignment?.horizontal === TEXT_HORIZONTAL_ALIGN.RIGHT;

  const isTextAlignCenter =
    nameTextFontSettings?.alignment?.horizontal ===
    TEXT_HORIZONTAL_ALIGN.CENTER;

  const title = new TextElementObject({
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
        pageTitleMargins.right
    },
    ...pageTitleFontSettings
  });

  const titleHeight = pxToIn(createTextBoxObject(title).object.height) - 0.2;

  const nameHeight =
    pxToIn(ptToPx(nameTextFontSettings.fontSize)) *
    nameLines *
    DEFAULT_LINE_HEIGHT;
  const textHeight = isNameOutSide ? 0 : nameHeight;

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

  const isFirstLast =
    nameDisplay.value === PORTRAIT_NAME_DISPLAY.FIRST_LAST.value;

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

  let lastImageWidth = 0;

  splitAssets.forEach((rowAssets, rowIndex) => {
    let textOffsetY = 0;

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

        const tmpX = colIndex * (itemWidth + colGap) + offsetX;
        const tmpY = rowIndex * (itemHeight + rowGap) + offsetY;

        const maxPageWidth = isRight ? pageWidth * 2 : pageWidth;
        const isOverFlow =
          isLargeAsst && tmpX + largeTeacherWidth > maxPageWidth;

        const nameSpace = `${nameLines > 1 ? '\n' : ' '}`;
        const value = isFirstLast
          ? `${firstName}${nameSpace}${lastName}`
          : `${lastName},${nameSpace}${firstName}`;
        const measureOptions = {
          fontSize: `${ptToPx(nameTextFontSettings.fontSize)}px`,
          fontFamily: nameTextFontSettings.fontFamily,
          textCase: nameTextFontSettings.textCase,
          fontWeight: nameTextFontSettings.isBold ? 'bold' : 'normal'
        };

        const textWidth =
          pxToIn(measureTextWidth(getActiveCanvas(), value, measureOptions)) +
          defaultTextPadding * 2;

        const imageWidth = isLargeAsst ? largeTeacherWidth : itemWidth;
        const imageHeight = isLargeAsst ? largeTeacherHeight : itemHeight;

        let imageX = isOverFlow ? offsetX : tmpX;
        let imageY = isOverFlow ? tmpY + itemHeight + rowGap : tmpY;

        if (isLargeAsst) {
          imageX += (itemWidth * 2 + colGap - imageWidth) / 2;
        }

        if (!colGap && !rowGap) {
          if (!isNameOutSide) {
            imageX = isRight
              ? (pageWidth - imageWidth) / 2 + bleedLeft + pageWidth
              : (pageWidth - imageWidth) / 2 + bleedLeft;
          }
          if (isNameOutSide && isRight) {
            imageX =
              (pageWidth - nameWidth - imageWidth) / 2 + bleedLeft + pageWidth;
          }
        }

        const isFirstImage = imageX < offsetX + itemWidth && rowIndex;
        const isOverlapX = isLargeAsst && imageX <= lastImageWidth;
        const isOverlapY =
          lastImageWidth === 0
            ? false
            : imageX + imageWidth > lastImageWidth - imageWidth;

        if (!isOverFlow && isOverlapX) {
          imageX += itemWidth + colGap;
        }
        if (isLargeAsst && isFirstImage && isOverlapY) {
          imageY += itemHeight + rowGap;
        }

        const img = new ImageElementObject({
          id: getUniqueId(),
          imageUrl,
          originalUrl: imageUrl,
          coord: { x: imageX, y: imageY },
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

        lastImageWidth = imageX + imageWidth;

        if (lastImageWidth > totalWidth) lastImageWidth = 0;

        let textOutsideX = 0;
        if (!isRight) textOutsideX = margins.left;
        else textOutsideX = pageWidth + margins.left + bleedLeft + totalWidth;

        const textOutsideY = imageY + textOffsetY - defaultTextPadding;
        textOffsetY += nameGap + nameHeight;

        let textX = 0;
        textX =
          (isTextAlignCenter || isTextAlignRight) && textWidth > imageWidth
            ? imageX - (textWidth - imageWidth) / 2
            : imageX - defaultTextPadding;
        const textY =
          imageY + imageHeight - defaultTextPadding + defaultTextGap;

        if (!colGap && !rowGap) {
          textX = isRight
            ? (pageWidth - imageWidth) / 2 - defaultTextPadding + pageWidth
            : (pageWidth - imageWidth) / 2 - defaultTextPadding;
        }

        const width = isNameOutSide
          ? Math.max(textWidth, nameWidth)
          : Math.max(imageWidth + defaultTextPadding * 2, textWidth);

        const text = new TextElementObject({
          id: getUniqueId(),
          text: value,
          coord: {
            x: isNameOutSide ? textOutsideX : textX,
            y: isNameOutSide ? textOutsideY : textY
          },
          size: {
            width,
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
 * @param {Object} settings flow settings for portraits
 * @param {Array} requiredPages pages are required to render portraits
 * @param isDigital flag for digital edition
 * @returns page objects will be stored
 */
export const getPageObjects = (
  settings,
  requiredPages,
  isDigital,
  requiredFolders
) => {
  const { teacherSettings, layoutSettings, flowMultiSettings } = settings;
  const {
    teacherPortraitSize,
    assistantTeacherPortraitSize,
    hasTeacher,
    teacherPlacement
  } = teacherSettings;

  const folders = requiredFolders || settings.folders;

  const { rowCount, colCount } = layoutSettings;
  const itemPerPage = rowCount * colCount;

  const isSingel = folders.length === 1;
  const isContinuousFlow =
    flowMultiSettings?.flowOption === PORTRAIT_FLOW_OPTION_MULTI.CONTINUE.id;

  const portraitRange = isSingel
    ? getRangePortraitSingleFolder(
        rowCount,
        colCount,
        folders[0],
        teacherSettings
      )
    : getRangePortraitMultiFolder(itemPerPage, folders, isContinuousFlow);

  const totalAssets = folders.reduce((rs, p) => rs.concat(p.assets), []);
  const pageObjects = {};

  requiredPages.forEach((page, index) => {
    const { min, max } = portraitRange[index] || {};
    const assets = totalAssets.splice(0, max - min + 1);
    const tmpAssets = [];

    const primaryTeachers = assets
      .map((asset, assetIndex) => ({
        ...asset,
        assetIndex
      }))
      .filter(
        asset =>
          hasTeacher &&
          asset.classRole === CLASS_ROLE.PRIMARY_TEACHER &&
          teacherPortraitSize === PORTRAIT_SIZE.LARGE
      );

    primaryTeachers.forEach((teacher, tIndex) => {
      assets.splice(teacher.assetIndex + 1 + tIndex, 0, {});
      tmpAssets.push({}, {});
    });

    const assistantTeachers = assets
      .map((asset, assetIndex) => ({
        ...asset,
        assetIndex
      }))
      .filter(
        asset =>
          hasTeacher &&
          asset.classRole === CLASS_ROLE.ASSISTANT_TEACHER &&
          assistantTeacherPortraitSize === PORTRAIT_SIZE.LARGE
      );

    assistantTeachers.forEach(teacher => {
      assets.splice(teacher.assetIndex + 1, 0, {});
      tmpAssets.push({}, {});
    });

    if (teacherPlacement === PORTRAIT_TEACHER_PLACEMENT.FIRST) {
      assets.splice(colCount, 0, ...tmpAssets);
    }

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
