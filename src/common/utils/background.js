import { isEmpty } from './util';

import { BACKGROUND_PAGE_TYPE, BACKGROUND_TYPE } from '@/common/constants';

export const isFullBackground = ({ pageType }) => {
  return pageType === BACKGROUND_PAGE_TYPE.FULL_PAGE.id;
};

/**
 * Get default background type
 *
 * @param   {Array}         themes  list of theme
 * @param   {String|Number} themeId current theme id
 * @returns {Object}                default background type
 */
const getDefaultType = (themes, themeId) => {
  const sub = themes.find(({ id }) => id === themeId);

  return {
    value: BACKGROUND_TYPE.THEME.id,
    sub: sub.id
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
  return isEmpty(background)
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
    : BACKGROUND_PAGE_TYPE.FULL_PAGE;

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
    : BACKGROUND_PAGE_TYPE.FULL_PAGE;

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

export const getBackgroundTypeOptions = () => {
  const types = {};

  Object.keys(BACKGROUND_TYPE).forEach(k => {
    types[k] = { id: BACKGROUND_TYPE[k].id, value: [] };
  });

  return types;
};
