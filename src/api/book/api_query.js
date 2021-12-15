import { graphqlRequest } from '../urql';
import { merge, pick } from 'lodash';

import {
  getPageLeftName,
  getPageRightName,
  getPageName,
  isEmpty,
  isOk
} from '@/common/utils';

import { bookMapping, sectionMapping, sheetMapping } from '@/common/mapping';

import {
  BookManagerDetail,
  BookPrintDetail,
  BookDigitalDetail,
  SectionBase,
  SheetPrintDetail,
  SheetDigitalDetail,
  SheetDetail,
  SpreadInfo
} from '@/common/models';

import {
  digitalEditorQuery,
  digitalMainQuery,
  managerQuery,
  printEditorQuery,
  printMainQuery
} from './queries';

import { EDITION } from '@/common/constants';

const getSpreadInfo = (firstPage, secondPage) => {
  return new SpreadInfo({
    leftTitle: firstPage.title,
    rightTitle: secondPage.title,
    isLeftNumberOn: firstPage.show_page_number,
    isRightNumberOn: secondPage.show_page_number
  });
};

/**
 * Get data of sheet of digital edition
 *
 * @param   {Object}          sheet         data of current sheet
 * @param   {String | Number} id            id of current section
 * @param   {Number}          index         index of current sheet in current section
 * @param   {Number}          totalSheets   total sheet from 1st section to current section
 * @returns {Object}                        data of sheet of digital edition
 */
const getDigitalSheet = (sheet, { id }, index, totalSheets) => {
  const isNoFrame = isEmpty(sheet?.digital_frames);

  const thumbnailUrl = isNoFrame
    ? ''
    : sheet.digital_frames[0].preview_image_url;

  const pageName = getPageName(index, totalSheets);

  const frameIds = isNoFrame ? [] : sheet.digital_frames.map(f => f.id);

  // sheet.is_visisted is used for print editor
  // For digital, if any frame is visited => sheet is visted
  const isVisited = sheet.digital_frames.some(f => f.is_visited);

  return new SheetDigitalDetail({
    ...sheetMapping(sheet),
    isVisited,
    sectionId: id,
    thumbnailUrl,
    pageName,
    frameIds
  });
};

/**
 * Get data of sheet of print edition
 *
 * @param   {Object}          sheet         data of current sheet
 * @param   {String | Number} id            id of current section
 * @param   {Number}          index         index of current sheet in current section
 * @param   {Number}          totalSheets   total sheet from 1st section to current section
 * @returns {Object}                        data of sheet of print edition
 */
const getPrintSheet = (sheet, { id }, index, totalSheets) => {
  const isNoPage = isEmpty(sheet?.pages);
  const isOnlyOnePage = isNoPage || sheet.pages.length < 2;

  const firstPage = isNoPage || isEmpty(sheet.pages[0]) ? {} : sheet.pages[0];

  const secondPage =
    isOnlyOnePage || isEmpty(sheet.pages[1]) ? {} : sheet.pages[1];

  const sheetData = sheetMapping(sheet);

  const pageLeftName = getPageLeftName(sheetData, index, totalSheets);
  const pageRightName = getPageRightName(sheetData, index, totalSheets);

  const pageIds = isNoPage ? [] : sheet.pages.map(p => p.id);

  return new SheetPrintDetail({
    ...sheetData,
    sectionId: id,
    thumbnailLeftUrl: firstPage.preview_image_url,
    thumbnailRightUrl: secondPage.preview_image_url,
    pageLeftName,
    pageRightName,
    pageIds,
    spreadInfo: getSpreadInfo(firstPage, secondPage)
  });
};

/**
 * Get data of sheet of manager edition
 *
 * @param   {Object}          sheet data of current sheet
 * @param   {String | Number} id    id of current section
 * @returns {Object}                data of sheet of manager edition
 */
const getManagerSheet = (sheet, { id }) => {
  return new SheetDetail({
    ...sheetMapping(sheet),
    sectionId: id
  });
};

/**
 * Get data of section of edition
 *
 * @param   {Object}  section           data of current section
 * @param   {Number}  totalSheets       total sheet from 1st section to current section
 * @param   {Object}  getSheetMethod    method use for getting sheet
 * @returns {Object}                    data of section of edition
 */
const getSection = (section, totalSheets, getSheetMethod) => {
  const sheets = {};
  const sheetIds = [];

  section.sheets.forEach((sheet, sheetIndex) => {
    const { id } = sheet;

    sheets[id] = getSheetMethod(sheet, section, sheetIndex, totalSheets);

    sheetIds.push(id);
  });

  const sectionDetail = new SectionBase({
    ...sectionMapping(section),
    sheetIds
  });

  return { sectionDetail, sheets };
};

/**
 * Get data of section of digital edition
 *
 * @param   {Object}  section       data of current section
 * @param   {Number}  totalSheets   total sheet from 1st section to current section
 * @returns {Object}                data of section of digital edition
 */
const getDigitalSection = (section, totalSheets) => {
  return getSection(section, totalSheets, getDigitalSheet);
};

/**
 * Get data of section of print edition
 *
 * @param   {Object}  section       data of current section
 * @param   {Number}  totalSheets   total sheet from 1st section to current section
 * @returns {Object}                data of section of print edition
 */
const getPrintSection = (section, totalSheets) => {
  return getSection(section, totalSheets, getPrintSheet);
};

/**
 * Get data of section of manager edition
 *
 * @param   {Object}  section data of current section
 * @returns {Object}          data of section of manager edition
 */
const getManagerSection = (section, totalSheets) => {
  return getSection(section, totalSheets, getManagerSheet);
};

/**
 * Get total screen & total sheet
 *
 * @param   {Number}  totalPages  total page of book
 * @returns {Object}              total sheet & total screen
 */
const getTotalData = totalPages => {
  const total = (totalPages + 4) / 2;

  return { totalSheets: total, totalScreens: total };
};

/**
 * Get the Get Section Method base on edition
 *
 * @param   {String}    edition current edition
 * @returns {Function}          method
 */
const getGetSectionMethod = edition => {
  const fn = {
    [EDITION.NONE]: getManagerSection,
    [EDITION.PRINT]: getPrintSection,
    [EDITION.DIGITAL]: getDigitalSection
  };

  return fn[edition];
};

/**
 * Get the Book Model base on edition
 *
 * @param   {String}  edition current edition
 * @returns {Class}           book model
 */
const getBookModel = edition => {
  const model = {
    [EDITION.NONE]: BookManagerDetail,
    [EDITION.PRINT]: BookPrintDetail,
    [EDITION.DIGITAL]: BookDigitalDetail
  };

  return model[edition];
};

/**
 * Get book data from API base on book id, current edition
 *
 * @param   {Number | String} bookId    id of selected book
 * @param   {String}          edition   current edition
 * @param   {Boolean}         isEditor  is in editor screen
 * @returns {Object}                    data of book
 */
const getBook = async (bookId, edition, isEditor) => {
  const editionQuery = {
    [EDITION.NONE]: { main: managerQuery, editor: managerQuery },
    [EDITION.PRINT]: { main: printMainQuery, editor: printEditorQuery },
    [EDITION.DIGITAL]: { main: digitalMainQuery, editor: digitalEditorQuery }
  };

  const query = editionQuery[edition][isEditor ? 'editor' : 'main'];

  const res = await graphqlRequest(query, { bookId });

  return isOk(res) ? res.data.book : {};
};

/**
 * Get book data from API base on book id, current edition
 *
 * @param   {Number | String} bookId    id of selected book
 * @param   {String}          edition   current edition
 * @param   {Boolean}         isEditor  is in editor screen
 * @returns {Object}                    data of book
 */
export const getBookDetail = async (bookId, edition, isEditor) => {
  const book = await getBook(bookId, edition, isEditor);

  const sections = [];
  const sheets = {};

  if (isEmpty(book)) return { book, sections, sheets };

  let totalSheetUntilNow = 0;

  const getSectionFn = getGetSectionMethod(edition);

  book.book_sections.sort(
    (item1, item2) => item1.section_order - item2.section_order
  );

  book.book_sections.forEach((section, index) => {
    section.sheets.sort(
      (item1, item2) => item1.sheet_order - item2.sheet_order
    );

    const data = getSectionFn(section, totalSheetUntilNow);

    if (
      (edition === EDITION.PRINT && index > 0) ||
      edition === EDITION.DIGITAL
    ) {
      totalSheetUntilNow += section.sheets.length;
    }

    sections.push(data.sectionDetail);

    merge(sheets, data.sheets);
  });

  const bookModel = getBookModel(edition);

  const totalData = isEditor ? {} : getTotalData(book.total_pages);
  const mappedBook = bookMapping(book);

  const pageInfo = pick(mappedBook, [
    'isNumberingOn',
    'position',
    'fontFamily',
    'fontSize',
    'color'
  ]);

  return {
    book: new bookModel({
      ...mappedBook,
      ...totalData,
      pageInfo
    }),
    sections,
    sheets
  };
};
