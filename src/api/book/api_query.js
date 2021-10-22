import { graphqlRequest } from '../axios';

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
  SheetPrintDetail,
  SheetDigitalDetail,
  SectionEditionDetail,
  SectionDetail,
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
  const pageName = getPageName(index, totalSheet);

  return new SheetDigitalDetail({
    ...sheetMapping(sheet),
    sectionId: id,
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

  const pageLeftName = getPageLeftName(sheetData, index, totalSheet);
  const pageRightName = getPageRightName(sheetData, index, totalSheet);

  return new SheetPrintDetail({
    ...sheetData,
    sectionId: id,
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

// TODO: digital data
/**
 * Get data of section of digital edition
 *
 * @param   {Object}  section     data of current section
 * @param   {Number}  totalSheet  total sheet from 1st section to current section
 * @returns {Object}              data of section of digital edition
 */
const getDigitalSection = (section, totalSheet) => {
  const sheets = section.sheets.map((sheet, sheetIndex) => {
    return getDigitalSheet(sheet, section, sheetIndex, totalSheet);
  });

  return new SectionEditionDetail({
    ...sectionMapping(section),
    sheets
  });
};

// TODO: print data
/**
 * Get data of section of print edition
 *
 * @param   {Object}  section     data of current section
 * @param   {Number}  totalSheet  total sheet from 1st section to current section
 * @returns {Object}              data of section of print edition
 */
const getPrintSection = (section, totalSheet) => {
  const sheets = section.sheets.map((sheet, sheetIndex) => {
    return getPrintSheet(sheet, section, sheetIndex, totalSheet);
  });

  return new SectionEditionDetail({
    ...sectionMapping(section),
    sheets
  });
};

/**
 * Get data of section of manager edition
 *
 * @param   {Object}  section data of current section
 * @returns {Object}          data of section of manager edition
 */
const getManagerSection = section => {
  const sheetIds = [];
  const sheets = {};

  section.sheets.forEach(sheet => {
    const { id } = sheet;

    sheets[id] = getManagerSheet(sheet, section);

    sheetIds.push(id);
  });

  const sectionDetail = new SectionDetail({
    ...sectionMapping(section),
    sheetIds
  });

  return {
    sectionDetail,
    sheets
  };
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

  const sections = book.book_sections.map((section, index) => {
    const editionSection = getSectionFn(section, totalSheetUntilNow);

    if (
      (edition === EDITION.PRINT && index > 0) ||
      edition === EDITION.DIGITAL
    ) {
      totalSheetUntilNow += section.sheets.length;
    }

    return editionSection;
  });

  const bookModel = getBookModel(edition);

  const totalData = isEditor ? {} : getTotalData(book.total_pages);

  return {
    book: new bookModel({
      ...bookMapping(book),
      ...totalData
    }),
    sectionsSheets: sections
  };
};
