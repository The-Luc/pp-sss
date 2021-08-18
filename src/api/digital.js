import { getSuccessWithData, getErrorWithMessages } from '@/common/models';
import { parseItem } from '@/common/storage/session.helper';

import { isEmpty, getPageName } from '@/common/utils';
import { cloneDeep } from 'lodash';

import bookService from './book';

const digitalService = {
  /**
   * Get default theme id book
   *
   * @param   {Number}  bookId  id of current book
   * @returns {Object}          query result
   */
  getDefaultThemeId: async bookId => {
    const { book } = await bookService.getBookDigital(bookId);
    const data = book.themeId;

    return isEmpty(data) ? getErrorWithMessages([]) : getSuccessWithData(data);
  },
  /**
   * Get list of section & sheets inside each section
   * use in main page
   *
   * @param   {Number}  bookId  id of current book
   * @returns {Object}          query result
   */
  getDigitalSectionsSheets: async bookId => {
    let totalSheets = 0;

    const {
      sectionsAsArray,
      sheets: sheetData
    } = await bookService.getBookDigital(bookId);

    const data = sectionsAsArray.map(section => {
      const sheets = section.sheetIds.map((sheetId, sheetIndex) => {
        const sheet = sheetData[sheetId];
        const { id, type, thumbnailUrl, link } = sheet;

        const pageName = getPageName(sheetIndex, totalSheets);

        return {
          id,
          type,
          thumbnailUrl,
          link,
          pageName
        };
      });

      totalSheets += section.sheetIds.length;

      const { name, color, assigneeId } = section;

      return { name, color, assigneeId, sheets };
    });

    return isEmpty(data) ? getErrorWithMessages([]) : getSuccessWithData(data);
  },
  /**
   * Get list of section & sheets inside each section
   * use in page edit
   *
   * @param   {Number}  bookId  id of current book
   * @returns {Object}          query result
   */
  getDigitalEditSectionsSheets: async bookId => {
    let totalSheets = 0;

    const coverType = parseItem('bookCoverType');
    const maxPage = parseItem('bookMaxPage');

    const {
      book,
      sectionsAsArray,
      sheets: sheetData
    } = await bookService.getBookDigital(bookId);

    if (!isEmpty(coverType)) book.coverOption = coverType;

    if (!isEmpty(maxPage)) book.numberMaxPages = parseInt(maxPage, 10);

    const data = sectionsAsArray.map(section => {
      const sheets = section.sheetIds.map((sheetId, sheetIndex) => {
        const {
          id,
          type,
          isVisited,
          thumbnailUrl,
          themeId,
          layoutId
        } = sheetData[sheetId];

        const pageName = getPageName(sheetIndex, totalSheets);

        return {
          id,
          type,
          thumbnailUrl,
          isVisited,
          themeId,
          layoutId,
          pageName
        };
      });

      totalSheets += section.sheetIds.length;

      const { name, color, assigneeId } = section;

      return { id: section.id, name, color, assigneeId, sheets };
    });

    return isEmpty(data) ? getErrorWithMessages([]) : getSuccessWithData(data);
  },
  /**
   * Get frames of a specific sheet
   * @param {Number} bookId Id of book
   * @param {Number} sectionId Id of section
   * @param {Number} sheetId Id of sheet
   * @returns {Promise<array>} a list of frames [{id, frame:{}},...]
   */
  getFrames: async (bookId, sectionId, sheetId) => {
    const { sheets } = await bookService.getBookDigital(bookId);

    const frames = sheets[sheetId].frames;

    const data = frames || [];

    return !data ? getErrorWithMessages([]) : getSuccessWithData(data);
  },
  // temporary code, will remove soon
  getGeneralInfo: async bookId => {
    const { book } = await bookService.getBookDigital(bookId);

    const { title, totalSheets, totalPages, totalScreens } = book;

    return {
      title,
      totalSheet: totalSheets,
      totalPage: totalPages,
      totalScreen: totalScreens
    };
  },
  updateSheet(sheetId, props) {
    return new Promise(resolve => {
      if (!sheetId) return;

      const sheets = getSheetsFromStorage();

      const sheet = sheets[sheetId];
      sheet.digitalData._set(props);

      resolve(sheet);
    });
  },

  /**
   * save theme id in global book variable
   * @param {Number} themeId id of theme that will be saved
   */
  saveDefaultThemeId: themeId => {
    return new Promise(resolve => {
      window.data.book.digitalData.themeId = themeId;

      resolve();
    });
  },

  /**
   * save data of Digital EditScreen to database
   */
  saveEditScreen: async (sheetId, payload) => {
    const { defaultThemeId, sheet, frames } = cloneDeep(payload);

    sheet.frames = frames;

    const saveQueue = [];

    // save default themeId
    saveQueue.push(digitalService.saveDefaultThemeId(defaultThemeId));

    saveQueue.push(digitalService.updateSheet(sheetId, sheet));
    const response = await Promise.all(saveQueue);

    // TODO: remove when integrate API
    // Simulate a delay when saving data to API
    await new Promise(r => setTimeout(() => r(), 300));

    return {
      data: response,
      status: 'OK'
    };
  },
  saveMainScreen: async data => {
    const sheets = getSheetsFromStorage();

    Object.values(sheets).forEach(s => s._set(data[s.id]));

    return;
  },
  /**
   * to save sheet media
   */
  saveSheetMedia: (sheetId, media) => {
    return digitalService.updateSheet(sheetId, { media });
  },

  /**
   * get media of sheet
   */
  getSheetMedia: sheetId => {
    const sheets = cloneDeep(getSheetsFromStorage());
    const { media } = sheets[sheetId].digitalData;
    return media;
  }
};

export default digitalService;

// TODO: Remove when integrate API
// Temporary helper function
function getSheetsFromStorage() {
  const sheets = {};
  window.data.book.sections.forEach(section => {
    section.sheets.forEach(sheet => (sheets[sheet.id] = sheet));
  });

  return sheets;
}
