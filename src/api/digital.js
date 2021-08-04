import { getSuccessWithData, getErrorWithMessages } from '@/common/models';
import { parseItem } from '@/common/storage/session.helper';

import { isEmpty, getPageName } from '@/common/utils';

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
   * Get list of objects use in canvas
   *
   * @param   {Number}  bookId    id of current book
   * @param   {Number}  sectionId id of current section
   * @param   {Number}  sheetId   id of current sheet
   * @returns {Object}            query result
   */
  getSheetObjects: async (bookId, sectionId, sheetId, frameId) => {
    const { sheets } = await bookService.getBookDigital(bookId);

    const frames = sheets[sheetId].frames;

    if (isEmpty(frames)) return {};

    const data = frames[frameId].objects || [];

    return isEmpty(data) ? getErrorWithMessages([]) : getSuccessWithData(data);
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
   * save layout and theme id of a sheet in global book variable
   * @param {Number} sheetId id of sheet
   * @param {Object} layout a layout object
   * @param {Number} themeId id of theme
   */
  saveSheetData: (sheetId, layoutId, themeId) => {
    return digitalService.updateSheet(sheetId, { layoutId, themeId });
  },

  /**
   * to mark that the sheet is visisted
   * @param {Number} sheetId id of sheet
   */
  saveSheetVisited: sheetId => {
    return digitalService.updateSheet(sheetId, { isVisited: true });
  },

  /**
   * save page info of a book in global book variable
   * @param {Object} pageInfo a object contains info such as font, color of the page
   */
  savePageInfo: pageInfo => {
    return new Promise(resolve => {
      window.data.book.digitalData.pageInfo = pageInfo;
      resolve();
    });
  },

  /**
   * to saves object and backgrounds
   */
  saveObjectsAndBackground: (sheetId, frameId, data) => {
    return new Promise(resolve => {
      if (!sheetId) {
        resolve();
        return;
      }
      const sheets = getSheetsFromStorage();

      const sheet = sheets[sheetId];
      const frame = sheet.digitalData.frames[frameId];

      frame.objects = data;

      resolve(data);
    });
  },

  /**
   * save sheet's thumbnail
   */
  saveSheetThumbnail: (sheetId, thumbnailUrl) => {
    return digitalService.updateSheet(sheetId, { thumbnailUrl });
  },

  /**
   * save data of Digital EditScreen to database
   */
  saveEditScreen: async (sheetId, frameId, payload) => {
    const { objects, defaultThemeId, pageInfo, sheetProps } = payload;

    const saveQueue = [];

    // save objects and backgrounds
    saveQueue.push(digitalService.saveObjectsAndBackground(sheetId, objects));

    // save default themeId
    saveQueue.push(digitalService.saveDefaultThemeId(defaultThemeId));

    // save pageInfo
    saveQueue.push(digitalService.savePageInfo(pageInfo));

    // save other data:
    //   + sheet's layout and sheet's themeId
    //   + sheet visite state
    //   + sheet's thumbnail
    //   + spreadInfo
    saveQueue.push(digitalService.updateSheet(sheetId, sheetProps));

    const response = await Promise.all(saveQueue);

    return {
      data: response,
      status: 'OK'
    };
  },
  saveMainScreen: async data => {
    const sheets = getSheetsFromStorage();

    Object.values(sheets).forEach(s => s._set(data[s.id]));

    return;
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
