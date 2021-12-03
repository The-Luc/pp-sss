import { OBJECT_TYPE, SHEET_TYPE } from '@/common/constants';
import { changeObjectsCoords, getPagePrintSize } from '.';

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

/**
 * To seperate sheet into 2 pages
 *
 * @param {Object} sheet sheet data
 * @returns {Object} left and right page
 */
export const mapSheetToPages = sheet => {
  const {
    isLeftNumberOn,
    isRightNumberOn,
    leftTitle,
    rightTitle
  } = sheet.sheetProps.spreadInfo;

  const { media } = sheet.sheetProps;

  const { leftLayout, rightLayout } = pageLayoutsFromSheet({
    media,
    objects: sheet.objects
  });

  const leftPage = {
    layout: leftLayout,
    otherProps: {
      title: leftTitle,
      show_page_number: isLeftNumberOn,
      preview_image_url: ''
    }
  };

  const rightPage = {
    layout: rightLayout,
    otherProps: {
      title: rightTitle,
      show_page_number: isRightNumberOn,
      preview_image_url: ''
    }
  };

  return { leftPage, rightPage };
};

/**
 * To seperate objects and media of sheet into pages
 *
 * @param {Object} sheetData sheet data: media and objects
 * @returns {leftLayout, rightLayout} elements and workspace for each page
 */
export const pageLayoutsFromSheet = sheetData => {
  const leftPageObjects = [];
  const rightPageObjects = [];
  const workspace = sheetData.media.map(m => m.id);

  const { pageWidth } = getPagePrintSize().inches;

  sheetData.objects.map((o, index) => {
    if (o.type === OBJECT_TYPE.BACKGROUND) {
      o.isLeftPage ? leftPageObjects.push(o) : rightPageObjects.push(o);
      return;
    }

    o.arrangeOrder = index;
    o.coord.x < pageWidth ? leftPageObjects.push(o) : rightPageObjects.push(o);
  });

  const leftLayout = {
    elements: leftPageObjects,
    workspace
  };

  const rightLayout = {
    elements: changeObjectsCoords(rightPageObjects, 'right', {
      moveToLeft: true
    }),
    workspace: []
  };
  return { leftLayout, rightLayout };
};

/**
 *  To get pageId based on page number
 *
 * @param {Number} pageNo number of the page will be applied portrait on
 * @returns {String}  pageId of the pageNo
 */
export const getPageIdFromPageNo = (pageNo, sheets, isDigital) => {
  if (isDigital) return pageNo;

  const sheet = Object.values(sheets).find(
    s => +s.pageLeftName === pageNo || +s.pageRightName === pageNo
  );

  if (!sheet) return null;

  if (isHalfSheet(sheet)) return sheet.pageIds[0];

  return +sheet.pageLeftName === pageNo ? sheet.pageIds[0] : sheet.pageIds[1];
};

/**
 *  To get pageIds of sheet
 *
 * @param {Array} pageIds page ids of sheet
 * @param {Number} sheetType sheet type
 * @returns {Array} array of [leftpageId, rightPageId]
 */
export const getPageIdsOfSheet = (pageIds, sheetType) => {
  if (sheetType === SHEET_TYPE.BACK_COVER) return [pageIds[0], null];
  if (sheetType === SHEET_TYPE.FRONT_COVER) return [null, pageIds[0]];
  return pageIds;
};
