import { SHEET_TYPE } from '@/common/constants';

export const isHalfSheet = ({ type }) => {
  return [SHEET_TYPE.FRONT_COVER, SHEET_TYPE.BACK_COVER].indexOf(type) >= 0;
};

export const isHalfLeft = ({ type }) => {
  return type === SHEET_TYPE.BACK_COVER;
};

export const isHalfRight = ({ type }) => {
  return type === SHEET_TYPE.FRONT_COVER;
};

/**
 * Format page number to name of page
 *
 * @param   {Number}  pageNumber  number of page
 * @returns {String}              name of page after format
 */
const formatPageNumber = pageNumber => {
  return `${pageNumber < 10 ? '0' : ''}${pageNumber}`;
};

/**
 * Get name of left page
 *
 * @param   {String}  type                    sheet type
 * @param   {Number}  sheetIndex              current sheet index in section
 * @param   {Number}  totalSheetUntilPrevious total sheet until previous section
 * @returns {String}                          name of left page
 */
export const getPageLeftName = (
  { type },
  sheetIndex,
  totalSheetUntilPrevious
) => {
  if (type === SHEET_TYPE.COVER) return 'Back Cover';

  if (type === SHEET_TYPE.FRONT_COVER) return 'Inside Front Cover';

  return formatPageNumber((totalSheetUntilPrevious + sheetIndex) * 2);
};

/**
 * Get name of right page
 *
 * @param   {String}  type                    sheet type
 * @param   {Number}  sheetIndex              current sheet index in section
 * @param   {Number}  totalSheetUntilPrevious total sheet until previous section
 * @returns {String}                          name of right page
 */
export const getPageRightName = (
  { type },
  sheetIndex,
  totalSheetUntilPrevious
) => {
  if (type === SHEET_TYPE.COVER) return 'Front Cover';

  if (type === SHEET_TYPE.FRONT_COVER) return formatPageNumber(1);

  if (type === SHEET_TYPE.BACK_COVER) return 'Inside Back Cover';

  return formatPageNumber((totalSheetUntilPrevious + sheetIndex) * 2 + 1);
};

/**
 * Get name of page
 *
 * @param   {Number}  sheetIndex              current sheet index in section
 * @param   {Number}  totalSheetUntilPrevious total sheet until previous section
 * @returns {String}                          name of page
 */
export const getPageName = (sheetIndex, totalSheetUntilPrevious) => {
  return formatPageNumber(totalSheetUntilPrevious + sheetIndex + 1);
};
