import { graphqlRequest } from '../axios';

import {
  getPageLeftName,
  getPageRightName,
  getPageName,
  mapObject,
  apiToBaseDate
} from '@/common/utils';

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

import {
  COVER_TYPE,
  EDITION,
  POSITION_FIXED,
  SHEET_TYPE,
  DELIVERY_OPTION
} from '@/common/constants';

//#region API DATA MAPPING
/**
 * Convert book data from API to data of Book Model
 *
 * @param   {Object}  book  book data from API
 * @returns {Object}        book data use by model
 */
const apiBookToModel = book => {
  const mapRules = {
    data: {
      community_id: {
        name: 'communityId'
      },
      created_at: {
        name: 'createdDate',
        parse: value => apiToBaseDate(value)
      },
      total_pages: {
        name: 'totalPage'
      },
      number_max_pages: {
        name: 'numberMaxPages'
      },
      yearbook_spec: {
        data: {
          cover_option: {
            name: 'coverOption',
            parse: value => COVER_TYPE[value]
          },
          delivery_option: {
            name: 'deliveryOption',
            parse: value => DELIVERY_OPTION[value]
          },
          copies_sold: {
            name: 'booksSold'
          },
          fundraising_earned: {
            name: 'fundraisingEarned'
          },
          estimated_quantity_high: {
            name: 'estimatedQuantity',
            parse: value => ({ max: value })
          },
          estimated_quantity_low: {
            name: 'estimatedQuantity',
            parse: value => ({ min: value })
          },
          delivery_date: {
            name: 'deliveryDate',
            parse: value => apiToBaseDate(value)
          },
          release_date: {
            name: 'releaseDate',
            parse: value => apiToBaseDate(value)
          },
          sale_date: {
            name: 'saleDate',
            parse: value => apiToBaseDate(value)
          }
        }
      }
    },
    restrict: ['book_sections']
  };

  return mapObject(book, mapRules);
};

/**
 * Convert section data from API to data of Section Model
 *
 * @param   {Object}  section section data from API
 * @returns {Object}          section data use by model
 */
const apiSectionToModel = section => {
  const mapRules = {
    data: {
      due_date: {
        name: 'dueDate',
        parse: value => apiToBaseDate(value)
      },
      assigned_user: {
        data: {
          id: {
            name: 'assigneeId'
          }
        }
      }
    },
    restrict: ['sheets']
  };

  return mapObject(section, mapRules);
};

/**
 * Convert sheet data from API to data of Sheet Model
 *
 * @param   {Object}  sheet sheet data from API
 * @returns {Object}        sheet data use by model
 */
const apiSheetToModel = sheet => {
  const mapRules = {
    data: {
      sheet_type: {
        name: 'type',
        parse: value => SHEET_TYPE[value]
      },
      fixed_position: {
        name: 'positionFixed',
        parse: value => POSITION_FIXED[value.replace(/(POSITION_)/g, '')]
      }
    },
    restrict: []
  };

  return mapObject(sheet, mapRules);
};
//#endregion

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
    ...apiSheetToModel(sheet),
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
  const sheetData = apiSheetToModel(sheet);

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
    ...apiSheetToModel(sheet),
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
    ...apiSectionToModel(section),
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
    ...apiSectionToModel(section),
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
    ...apiSectionToModel(section),
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

  return res.data.book;
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
export const getBookDetail = async (bookId, edition, isEditor) => {
  const book = await getBook(bookId, edition, isEditor);

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
      ...apiBookToModel(book),
      ...totalData
    }),
    sectionsSheets: sections
  };
};
