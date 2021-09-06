import { inToPx } from './canvas';

/**
 * Get range of portrait for selected page
 *
 * @param   {Number}  currentIndex  index of page in list of selected page
 * @param   {Number}  maxPortrait   max portrait per page
 * @param   {Number}  totalPortrait total portrait
 * @returns {Object}                min index & max index of protrait in folder
 */
const getRangePortraitSingleFolder = (
  currentIndex,
  maxPortrait,
  totalPortrait
) => {
  const estimatePortrait = maxPortrait * (currentIndex + 1);

  const min = maxPortrait * currentIndex;
  const max =
    estimatePortrait > totalPortrait ? totalPortrait - 1 : estimatePortrait - 1;

  return { min, max };
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
  totalPortrait
) => {
  const { min, max } = getRangePortraitSingleFolder(
    currentIndex,
    maxPortrait,
    totalPortrait
  );

  return [...Array(max - min + 1).keys()].map(k => {
    return folders[0].assets[k + min];
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
  totalPortrait,
  folders
) => {
  if (folders.length === 1) {
    return getPortraitsSingleFolder(
      currentIndex,
      rowCount * colCount,
      folders,
      totalPortrait
    );
  }

  return [];
};

/**
 *  To convert a value to appropriate ratio that used in preview portrait
 * Inch to px with specific ratio
 * @param {Number} val value will be converted
 * @returns A value will be use in preview portrait
 */
export const getConvertedPreviewValue = val => {
  // 20 is just arbitrary choie, need to discuss to find a right number
  return inToPx(val) / 20;
};
