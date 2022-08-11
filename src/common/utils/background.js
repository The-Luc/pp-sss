import { cloneDeep } from 'lodash';
import { isHalfLeft, isHalfRight } from './sheet';
import { isEmpty, compareByValue } from './util';

import {
  BACKGROUND_PAGE_TYPE,
  BACKGROUND_TYPE,
  OBJECT_TYPE
} from '@/common/constants';
import { generateCanvasThumbnail, splitBase64Image } from '.';

export const isFullBackground = ({ pageType }) => {
  return (
    !isEmpty(pageType) && pageType === BACKGROUND_PAGE_TYPE.DOUBLE_PAGE?.id
  );
};

/**
 *  To check if an object a background or not
 *
 * @param {Object} bg background object
 * @returns whether an object a backround or not
 */
export const isBackground = bg => bg && bg.type === OBJECT_TYPE.BACKGROUND;

/**
 *  To check if an fabric object a background or not
 *
 * @param {Object} bg background object
 * @returns whether an object a backround or not
 */
export const isFbBackground = bg =>
  bg && bg.objectType === OBJECT_TYPE.BACKGROUND;

/**
 * Get default background type
 *
 * @param   {Array}         themes  list of theme
 * @param   {String|Number} themeId current theme id
 * @returns {Object}                default background type
 */
const getDefaultType = (themes, themeId) => {
  const sub = themes.find(({ id }) => id === themeId) || themes[0];

  return {
    value: BACKGROUND_TYPE.THEME.id,
    sub: sub?.id
  };
};

/**
 * Get background type from applied background
 *
 * @param   {Object}  background      applied background
 * @param   {Object}  backgroundTypes list of background type
 * @returns {Object}                  background type
 */
const getType = (background, backgroundTypes) => {
  const backgroundType = Object.keys(BACKGROUND_TYPE).find(
    k => BACKGROUND_TYPE[k].id === background.backgroundType
  );

  if (isEmpty(backgroundType)) {
    return { value: '', sub: '' };
  }

  const sub = backgroundTypes[backgroundType].value.find(
    v => v.id === background.categoryId
  );

  return {
    value: BACKGROUND_TYPE[backgroundType].id,
    sub: sub.id
  };
};

/**
 * Get background type
 *
 * @param   {Object}        background      applied background
 * @param   {Object}        backgroundTypes list of background type
 * @param   {String|Number} themeId         current theme id
 * @returns {Object}                        background type
 */
export const getBackgroundType = (background, backgroundTypes, themeId) => {
  const { id } = background;

  return isEmpty(id)
    ? getDefaultType(backgroundTypes.THEME.value, themeId)
    : getType(background, backgroundTypes);
};

/**
 * Get default background page type
 *
 * @param   {Booean}  isHalfSheet is current shet a half sheet
 * @returns {Object}              default background page type
 */
const getDefaultPageType = isHalfSheet => {
  const pageType = isHalfSheet
    ? BACKGROUND_PAGE_TYPE.SINGLE_PAGE
    : BACKGROUND_PAGE_TYPE.GENERAL;

  return {
    ...pageType,
    value: pageType.id
  };
};

/**
 * Get background page type from applied background
 *
 * @param   {Object}  background  applied background
 * @param   {Booean}  isHalfSheet is current shet a half sheet
 * @returns {Object}              background page type
 */
const getPageType = (background, isHalfSheet) => {
  const currentPageType = Object.keys(BACKGROUND_PAGE_TYPE).find(k => {
    return BACKGROUND_PAGE_TYPE[k].id === background.pageType;
  });

  if (!isEmpty(currentPageType)) {
    return {
      ...BACKGROUND_PAGE_TYPE[currentPageType],
      value: BACKGROUND_PAGE_TYPE[currentPageType].id
    };
  }

  const selectedPageType = isHalfSheet
    ? BACKGROUND_PAGE_TYPE.SINGLE_PAGE
    : BACKGROUND_PAGE_TYPE.GENERAL;

  return {
    ...selectedPageType,
    value: selectedPageType.id
  };
};

/**
 * Get background page type
 *
 * @param   {Object}  background  applied background
 * @param   {Booean}  isHalfSheet is current shet a half sheet
 * @returns {Object}              background page type
 */
export const getBackgroundPageType = (background, isHalfSheet) => {
  return isEmpty(background)
    ? getDefaultPageType(isHalfSheet)
    : getPageType(background, isHalfSheet);
};

/**
 * Get default background type options base on background type
 *
 * @returns {Array}  background type options
 */
export const getDefaultBackgroundTypeOptions = () => {
  const types = {};

  Object.keys(BACKGROUND_TYPE).forEach(k => {
    types[k] = { id: BACKGROUND_TYPE[k].id, value: [] };
  });

  return types;
};

/**
 * Get display background type base on background type option
 *
 * @param   {Array} backgroundTypeOptions background type options
 * @returns {Array}                       display background type
 */
export const getDisplayBackgroundTypes = backgroundTypeOptions => {
  const typeOptions = isEmpty(backgroundTypeOptions)
    ? getDefaultBackgroundTypeOptions()
    : backgroundTypeOptions;

  const types = Object.keys(BACKGROUND_TYPE).map(k => {
    return {
      ...BACKGROUND_TYPE[k],
      value: BACKGROUND_TYPE[k].id,
      subItems: typeOptions[k].value
    };
  });

  return types.filter(b => b.subItems.length > 0).sort(compareByValue);
};

/**
 * Get display background page type
 *
 * @returns {Array} display background page type
 */
export const getDisplayBackgroundPageTypes = () => {
  return Object.keys(BACKGROUND_PAGE_TYPE)
    .map(k => {
      return {
        ...BACKGROUND_PAGE_TYPE[k],
        value: BACKGROUND_PAGE_TYPE[k].id
      };
    })
    .sort(compareByValue);
};

/**
 * Get the background of current page using its id
 *
 * @param   {Number}  pageId        id of page need to get background
 * @param   {Object}  currentSheet  current sheet data
 * @param   {Object}  currentBgs    current backgrounds of current sheet
 * @returns {Object}                background of selected page
 */
export const getCurrentSheetBackground = (pageId, currentSheet, currentBgs) => {
  if (isHalfLeft(currentSheet)) return currentBgs.left;

  if (isHalfRight(currentSheet)) return currentBgs.right;

  if (currentSheet.pageIds[0] === pageId) return currentBgs.left;

  if (!isEmpty(currentBgs.right)) return currentBgs.right;

  return isFullBackground(currentBgs.left) ? currentBgs.left : {};
};

/**
 * Get the background of current page using its id
 *
 * @param   {Number}  frameNo       number of frame need to get background
 * @param   {Array}   frames        current frames in sheet
 * @returns {Object}                background of selected frame
 */
export const getFrameBackgroundUtil = (frameNo, frames) => {
  if (isEmpty(frameNo) || frameNo > frames.length) return {};

  const objects = frames[frameNo - 1]?.objects;

  const firstObject = isEmpty(objects) ? {} : objects[0];

  return isEmpty(firstObject) || firstObject.type !== OBJECT_TYPE.BACKGROUND
    ? {}
    : firstObject;
};

/**
 *  To modify a background so that it can be render on a page, without this
 *  the background only rendered half of the width of the page.
 *
 * @param {Object} bg background data
 * @returns modified background
 */
export const modifyBgToRenderOnPage = bg => ({
  ...bg,
  pageType: BACKGROUND_PAGE_TYPE.DOUBLE_PAGE.id,
  isLeftPage: true
});

/**
 * To generate thumbnail from sheet object data
 *
 * @param {Object} leftObjects objects on left page
 * @param {Object} rightObjects objects on right page
 * @returns Array of left and right thumbnails
 */
export const getSheetThumbnail = async (leftObjects, rightObjects) => {
  const isFullBg = leftObjects[0] && isFullBackground(leftObjects[0]);

  let leftElements = cloneDeep(leftObjects);
  let rightElements = cloneDeep(rightObjects);

  if (isFullBg) {
    const { leftThumb, rightThumb } = await splitBase64Image(
      leftObjects[0].imageUrl
    );
    const leftBg = cloneDeep(leftObjects[0]);
    const rightBg = cloneDeep(leftObjects[0]);
    leftBg.imageUrl = leftThumb;
    rightBg.imageUrl = rightThumb;

    rightElements = [rightBg, ...rightElements];
    leftElements = [leftBg, ...leftElements.slice(1)];
  } else {
    isBackground(rightElements[0]) &&
      (rightElements[0] = modifyBgToRenderOnPage(rightElements[0]));
    isBackground(leftElements[0]) &&
      (leftElements[0] = modifyBgToRenderOnPage(leftElements[0]));
  }

  return Promise.all([
    generateCanvasThumbnail(leftElements),
    generateCanvasThumbnail(rightElements)
  ]);
};
