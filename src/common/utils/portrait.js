import { DEFAULT_IMAGE } from '../constants';
import { ImageElementObject } from '../models/element';
import { getPagePrintSize, pxToIn } from './canvas';
import { getUniqueId } from './util';
import {
  CLASS_ROLE,
  PORTRAIT_ASSISTANT_PLACEMENT,
  PORTRAIT_SIZE,
  PORTRAIT_TEACHER_PLACEMENT
} from '@/common/constants';

import { cloneDeep } from 'lodash';

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
  const portraitsOnLastPage = assetsCount % maxPortrait;
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

  if (numTeacher > 2) return 0;

  if (numTeacher === 2) return 6;

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
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
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

  teachers.sort(sortPortraitByName);
  asstTeachers.sort(sortPortraitByName);
  students.sort(sortPortraitByName);

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
 * @return array image objects
 */
export const createPortraitImage = settings => {
  const { colCount, rowCount } = settings.layoutSettings;

  const colGap = 100;
  const rowGap = 100;

  const totalColGap = (colCount - 1) * colGap;
  const totalRowGap = rowCount * rowGap;

  const { safeMargin, pageWidth, pageHeight } = getPagePrintSize().pixels;

  const totalWidth = pageWidth - totalColGap - safeMargin * 2;
  const totalHeight = pageHeight - totalRowGap - safeMargin * 2;

  const itemWidth = totalWidth / colCount;
  const itemHeight = totalHeight / rowCount;

  const imgs = Array.from({ length: rowCount }, (_, j) => {
    return Array.from({ length: colCount }, (_, i) => ({
      ...new ImageElementObject({
        id: getUniqueId(),
        imageUrl: DEFAULT_IMAGE.IMAGE_URL
      }),
      coord: {
        rotation: 0,
        x: i * pxToIn(itemWidth + colGap) + pxToIn(safeMargin) + 0.1,
        y: j * pxToIn(itemHeight + rowGap) + pxToIn(safeMargin) + 0.1
      },
      size: {
        width: pxToIn(itemWidth),
        height: pxToIn(itemHeight)
      },
      selectable: false,
      hasImage: true
    }));
  });
  return [].concat(...imgs);
};
