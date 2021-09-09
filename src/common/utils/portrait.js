import {
  CLASS_ROLE,
  PORTRAIT_ASSISTANT_PLACEMENT,
  PORTRAIT_SIZE,
  PORTRAIT_TEACHER_PLACEMENT
} from '@/common/constants';

import { cloneDeep } from 'lodash';

/**
 * Get range of portrait for selected page
 *
 * @param   {Number}  currentIndex  index of page in list of selected page
 * @param   {Number}  maxPortrait   max portrait per page
 * @param   {Number}  totalPortrait total portrait
 * @returns {Object}                min index & max index of protrait in folder
 */
const getRangePortrait = (currentIndex, maxPortrait, totalPortrait) => {
  const estimatePortrait = maxPortrait * (currentIndex + 1);

  const min = maxPortrait * currentIndex;
  const max = Math.min(totalPortrait, estimatePortrait) - 1;

  return { min, max };
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
const getRangePortraitSingleFolder = (
  currentIndex,
  maxPortrait,
  folders,
  teacherSettings
) => {
  const { isHasLargeTeacher } = isHasLargePortrait(teacherSettings);
  const totalPortrait = folders.reduce((sum, f) => sum + f.assetsCount, 0);

  if (folders.length > 1 || !isHasLargeTeacher) {
    return getRangePortrait(currentIndex, maxPortrait, totalPortrait);
  }

  // how many additional slots
  const extraSlots = calcAdditionPortraitSlot(teacherSettings, folders[0]);

  // first placement
  if (teacherSettings.teacherPlacement === PORTRAIT_TEACHER_PLACEMENT.FIRST) {
    const { min, max } = getRangePortrait(
      currentIndex,
      maxPortrait,
      totalPortrait
    );

    return { min: Math.max(min - extraSlots, 0), max: max - extraSlots };
  }

  if (teacherSettings.teacherPlacement === PORTRAIT_TEACHER_PLACEMENT.LAST) {
    const { min, max } = getRangePortrait(
      currentIndex,
      maxPortrait,
      totalPortrait
    );

    // TODO: -Luc: will be implement next
    // currentIndex out of range: last page only large portrait
    // const numberLargePortrait = extraSlots % 3;

    return { min, max };
  }
};

/**
 * Get range of portrait for selected page
 *
 * @param   {Number}  currentIndex  index of page in list of selected page
 * @param   {Number}  maxPortrait   max portrait per page
 * @param   {Array}   folders       selected portrait folders
 * @returns {Object}                min index & max index of protrait and folder index
 */
const getRangePortraitMultiFolder = (currentIndex, maxPortrait, folders) => {
  // for auto flow
  const portraitInPages = [];

  // TODO: -Luc: Need to improve later for better performance
  folders.forEach((folder, idx) => {
    const pages = Math.ceil(folder.assetsCount / maxPortrait);
    for (let i = 0; i < pages; i++) {
      const { max, min } = getRangePortrait(i, maxPortrait, folder.assetsCount);
      portraitInPages.push({ folderIdx: idx, min, max });
    }
  });
  const { max, min, folderIdx } = portraitInPages[currentIndex];

  return { min, max, folderIdx };
};

/**
 * Get portraits for select page (single folder)
 *
 * @param   {Number}  currentIndex  index of page in list of selected page
 * @param   {Number}  maxPortrait   max portrait per page
 * @param   {Array}   folders       selected portrait folders
 * @param   {Number}  totalPortrait total portrait
 * @returns {Array}                 portraits
 */
const getPortraitsSingleFolder = (
  currentIndex,
  maxPortrait,
  folders,
  teacherSettings
) => {
  const { min, max } = getRangePortraitSingleFolder(
    currentIndex,
    maxPortrait,
    folders,
    teacherSettings
  );

  const assets = folders.reduce((result, item) => {
    return result.concat(item.assets);
  }, []);

  return [...Array(max - min + 1).keys()].map(k => {
    return assets[k + min];
  });
};

/**
 * Get portraits for select page (multi-folder)
 *
 * @param   {Number}  currentIndex  index of page in list of selected page
 * @param   {Number}  maxPortrait   max portrait per page
 * @param   {Array}   folders       selected portrait folders
 * @returns {Array}                 portraits
 */
const getPortraitsMultiFolder = (currentIndex, maxPortrait, folders) => {
  const { min, max, folderIdx } = getRangePortraitMultiFolder(
    currentIndex,
    maxPortrait,
    folders
  );

  return [...Array(max - min + 1).keys()].map(k => {
    return folders[folderIdx].assets[k + min];
  });
};

/**
 * Get portraits for select page
 *
 * @param   {Number}  currentIndex  index of page in list of selected page
 * @param   {Number}  rowCount      total row in config
 * @param   {Number}  colCount      total column in config
 * @param   {Number}  totalPortrait total portrait
 * @param   {Array}   folders       selected portrait folders
 * @returns {Array}                 portraits
 */
export const getPortraitForPage = (
  currentIndex,
  rowCount,
  colCount,
  teacherSettings,
  folders,
  isSingle
) => {
  if (isSingle) {
    return getPortraitsSingleFolder(
      currentIndex,
      rowCount * colCount,
      folders,
      teacherSettings
    );
  }

  return getPortraitsMultiFolder(currentIndex, rowCount * colCount, folders);
};

/**
 * To caculate the number of slots need for large size portraits
 *
 * @param {Object} teacherSettings config for teacherSettings
 * @param {Array} folder array of portrait in selected folder
 * @returns number of slots need for large size portraits
 */
export const calcAdditionPortraitSlot = (teacherSettings, folder) => {
  if (!teacherSettings.hasTeacher) return 0;

  let numTeacher = 0;
  let numAssistant = 0;

  folder.assets.forEach(p => {
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
    assistantTeacherPortraitSize
  } = teacherSettings;

  const isHasLargeTeacher =
    hasTeacher && teacherPortraitSize === PORTRAIT_SIZE.LARGE;
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
