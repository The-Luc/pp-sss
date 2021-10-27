import { graphqlRequest } from '../axios';
import { merge } from 'lodash';

import {
  getPageLeftName,
  getPageRightName,
  getPageName,
  isEmpty
} from '@/common/utils';

import { bookMapping, sectionMapping, sheetMapping } from '@/common/mapping';

import {
  BookManagerDetail,
  BookPrintDetail,
  BookDigitalDetail,
  SectionBase,
  SheetPrintDetail,
  SheetDigitalDetail,
  SheetDetail
} from '@/common/models';

import {
  digitalEditorQuery,
  digitalMainQuery,
  managerQuery,
  printEditorQuery,
  printMainQuery
} from './queries';

import { EDITION } from '@/common/constants';

const sortByOrder = (item1, item2) => item1.order - item2.order;

// TODO: digital data
/**
 * Get data of sheet of digital edition
 *
 * @param   {Object}          sheet       data of current sheet
 * @param   {String | Number} id          id of current section
 * @param   {Number}          index       index of current sheet in current section
 * @param   {Number}          totalSheet  total sheet from 1st section to current section
 * @returns {Object}                      data of sheet of digital edition
 */
const getDigitalSheet = (sheet, { id }, index, totalSheet) => {
  const thumbnailUrl = isEmpty(sheet?.digital_frames)
    ? null
    : sheet.digital_frames[0]?.preview_image_url;

  const pageName = getPageName(index, totalSheet);

  return new SheetDigitalDetail({
    ...sheetMapping(sheet),
    sectionId: id,
    thumbnailUrl,
    pageName
  });
};

// TODO: print data
/**
 * Get data of sheet of print edition
 *
 * @param   {Object}          sheet       data of current sheet
 * @param   {String | Number} id          id of current section
 * @param   {Number}          index       index of current sheet in current section
 * @param   {Number}          totalSheet  total sheet from 1st section to current section
 * @returns {Object}                      data of sheet of print edition
 */
const getPrintSheet = (sheet, { id }, index, totalSheet) => {
  const sheetData = sheetMapping(sheet);

  const thumnailLeftUrl = isEmpty(sheet?.pages)
    ? null
    : sheet.pages[0]?.preview_image_url;
  const thumnailRightUrl =
    isEmpty(sheet?.pages) || sheet.pages.length < 2
      ? null
      : sheet.pages[1]?.preview_image_url;

  const pageLeftName = getPageLeftName(sheetData, index, totalSheet);
  const pageRightName = getPageRightName(sheetData, index, totalSheet);

  return new SheetPrintDetail({
    ...sheetData,
    sectionId: id,
    thumnailLeftUrl,
    thumnailRightUrl,
    pageLeftName,
    pageRightName
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
 * @param   {Object}  section         data of current section
 * @param   {Number}  totalSheet      total sheet from 1st section to current section
 * @param   {Object}  getSheetMethod  method use for getting sheet
 * @returns {Object}                  data of section of edition
 */
const getSection = (section, totalSheet, getSheetMethod) => {
  const sheets = {};
  const sheetIds = [];

  section.sheets.forEach((sheet, sheetIndex) => {
    const { id } = sheet;

    sheets[id] = getSheetMethod(sheet, section, sheetIndex, totalSheet);

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
 * @param   {Object}  section     data of current section
 * @param   {Number}  totalSheet  total sheet from 1st section to current section
 * @returns {Object}              data of section of digital edition
 */
const getDigitalSection = (section, totalSheet) => {
  return getSection(section, totalSheet, getDigitalSheet);
};

/**
 * Get data of section of print edition
 *
 * @param   {Object}  section     data of current section
 * @param   {Number}  totalSheet  total sheet from 1st section to current section
 * @returns {Object}              data of section of print edition
 */
const getPrintSection = (section, totalSheet) => {
  return getSection(section, totalSheet, getPrintSheet);
};

/**
 * Get data of section of manager edition
 *
 * @param   {Object}  section data of current section
 * @returns {Object}          data of section of manager edition
 */
const getManagerSection = (section, totalSheet) => {
  return getSection(section, totalSheet, getManagerSheet);
};

/**
 * Get total screen & total sheet
 *
 * @param   {Number}  totalPage total page of book
 * @returns {Object}            total sheet & total screen
 */
const getTotalData = totalPage => {
  const total = (totalPage + 4) / 2;

  return { totalSheet: total, totalScreen: total };
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

  const { data } = await graphqlRequest(query, { bookId });

  return data.book;
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

  if (isEmpty(book)) return { book: {}, sectionsSheets: [] };

  let totalSheetUntilNow = 0;

  const getSectionFn = getGetSectionMethod(edition);

  book.book_sections.sort(sortByOrder);

  const sections = [];
  const sheets = {};

  book.book_sections.forEach((section, index) => {
    section.sheets.sort(sortByOrder);

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

  return {
    book: new bookModel({
      ...bookMapping(book),
      ...totalData
    }),
    sections,
    sheets
  };
};
