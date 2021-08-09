import { cloneDeep } from 'lodash';
import { getSuccessWithData, getErrorWithMessages } from '@/common/models';
import { parseItem } from '@/common/storage/session.helper';

import { isEmpty, getPageLeftName, getPageRightName } from '@/common/utils';
import bookService from './book';

const printService = {
  /**
   * Get default theme id book
   *
   * @param   {Number}  bookId  id of current book
   * @returns {Object}          query result
   */
  getDefaultThemeId: async bookId => {
    const { book } = await bookService.getBookPrint(bookId);

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
  getPrintSectionsSheets: async bookId => {
    let totalSheets = 0;

    const {
      sectionsAsArray,
      sheets: sheetData
    } = await bookService.getBookPrint(bookId);

    const data = sectionsAsArray.map((section, sectionIndex) => {
      const sheets = section.sheetIds.map((sheetId, sheetIndex) => {
        const sheet = sheetData[sheetId];
        const { id, type, thumbnailUrl, link, media } = sheet;

        const pageLeftName = getPageLeftName(sheet, sheetIndex, totalSheets);
        const pageRightName = getPageRightName(sheet, sheetIndex, totalSheets);

        return {
          id,
          type,
          thumbnailUrl,
          link,
          pageLeftName,
          pageRightName,
          media
        };
      });

      if (sectionIndex > 0) {
        totalSheets += section.sheetIds.length;
      }

      const { name, color, id, assigneeId } = section;

      return { id, name, color, assigneeId, sheets };
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
  getPrintEditSectionsSheets: async bookId => {
    let totalSheets = 0;

    const coverType = parseItem('bookCoverType');
    const maxPage = parseItem('bookMaxPage');

    const {
      book,
      sectionsAsArray,
      sheets: sheetData
    } = await bookService.getBookPrint(bookId);

    if (!isEmpty(coverType)) book.coverOption = coverType;

    if (!isEmpty(maxPage)) book.numberMaxPages = parseInt(maxPage, 10);

    const data = sectionsAsArray.map((section, sectionIndex) => {
      const sheets = section.sheetIds.map((sheetId, sheetIndex) => {
        const sheet = sheetData[sheetId];

        const {
          id,
          type,
          isVisited,
          link,
          thumbnailUrl,
          themeId,
          layoutId,
          spreadInfo,
          media
        } = sheet;
        const pageLeftName = getPageLeftName(sheet, sheetIndex, totalSheets);
        const pageRightName = getPageRightName(sheet, sheetIndex, totalSheets);

        return {
          id,
          link,
          type,
          thumbnailUrl,
          isVisited,
          themeId,
          layoutId,
          pageLeftName,
          pageRightName,
          spreadInfo: { ...spreadInfo },
          media
        };
      });

      if (sectionIndex > 0) {
        totalSheets += section.sheetIds.length;
      }

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
  getSheetObjects: async (bookId, sectionId, sheetId) => {
    // TODO: Remove when integrate API
    bookId;

    const { objects } = await bookService.getBookPrint(bookId);

    const data = objects[sheetId] || [];

    return isEmpty(data) ? getErrorWithMessages([]) : getSuccessWithData(data);
  },
  /**
   * Get print page info
   *
   * @param   {Number}  bookId  id of current book
   * @returns {Object}          query result
   */
  getPageInfo: async bookId => {
    const { book } = await bookService.getBookPrint(bookId);

    const data = book.pageInfo;

    return isEmpty(data)
      ? getErrorWithMessages([])
      : getSuccessWithData({ ...data });
  },
  // temporary code, will remove soon
  getGeneralInfo: async bookId => {
    const { book } = await bookService.getBookPrint(bookId);

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
      sheet.printData._set(props);

      resolve(sheet);
    });
  },

  /**
   * save theme id in global book variable
   * @param {Number} themeId id of theme that will be saved
   */
  saveDefaultThemeId: themeId => {
    return new Promise(resolve => {
      window.data.book.printData.themeId = themeId;

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
    return printService.updateSheet(sheetId, { layoutId, themeId });
  },

  /**
   * to mark that the sheet is visisted
   * @param {Number} sheetId id of sheet
   */
  saveSheetVisited: sheetId => {
    return printService.updateSheet(sheetId, { isVisited: true });
  },

  /**
   * save page info of a book in global book variable
   * @param {Object} pageInfo a object contains info such as font, color of the page
   */
  savePageInfo: pageInfo => {
    return new Promise(resolve => {
      window.data.book.printData.pageInfo = pageInfo;
      resolve();
    });
  },

  /**
   * save spread info in global book variable
   * @param {Object} spreadInfo information of the spread such as title, page number
   * @param {Number} sheetId id of a sheet
   */
  saveSpreadInfo: (sheetId, spreadInfo) => {
    return new Promise(resolve => {
      const sheets = getSheetsFromStorage();

      const sheet = sheets[sheetId];

      sheet.printData.spreadInfo = { ...sheet.spreadInfo, ...spreadInfo };
      resolve();
    });
  },

  /**
   * to save sheet link status
   */
  saveSheetLinkStatus: (sheetId, link) => {
    return printService.updateSheet(sheetId, { link });
  },

  /**
   * to save sheet media
   */
  saveSheetMedia: (sheetId, media) => {
    return printService.updateSheet(sheetId, { media });
  },

  /**
   * get media of sheet
   */
  getSheetMedia: sheetId => {
    const sheets = cloneDeep(getSheetsFromStorage());
    const { media } = sheets[sheetId].printData;
    return media;
  },

  /**
   * Delete media from sheet by id
   * @param {String} sheetId sheet's id to delete media
   * @param {String} mediaId media's id will be deleted
   * @returns {Array} list media after delete
   */
  deleteSheetMediaById: async (sheetId, mediaId) => {
    try {
      if (!sheetId || !mediaId) throw false;
      const sheets = cloneDeep(getSheetsFromStorage());
      const { media } = sheets[sheetId].printData;
      const newMedia = media.filter(item => item.id !== mediaId);
      await printService.updateSheet(sheetId, { media: newMedia });
      return Promise.resolve(newMedia);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  /**
   * to saves object and backgrounds
   */
  saveObjectsAndBackground: (sheetId, data) => {
    return new Promise(resolve => {
      if (!sheetId) {
        resolve();
        return;
      }
      const sheets = getSheetsFromStorage();

      const sheet = sheets[sheetId];

      sheet.printData.objects = data;

      resolve(data);
    });
  },

  /**
   * save sheet's thumbnail
   */
  saveSheetThumbnail: (sheetId, thumbnailUrl) => {
    return printService.updateSheet(sheetId, { thumbnailUrl });
  },

  /**
   * save data of Print Edit Screen to database
   */
  saveEditScreen: async (sheetId, payload) => {
    const { objects, defaultThemeId, pageInfo, sheetProps } = payload;

    const saveQueue = [];

    // save objects and backgrounds
    saveQueue.push(printService.saveObjectsAndBackground(sheetId, objects));

    // save default themeId
    saveQueue.push(printService.saveDefaultThemeId(defaultThemeId));

    // save pageInfo
    saveQueue.push(printService.savePageInfo(pageInfo));

    // save other data:
    //   + sheet's layout and sheet's themeId
    //   + sheet visite state
    //   + sheet's thumbnail
    //   + spreadInfo
    saveQueue.push(printService.updateSheet(sheetId, sheetProps));

    const response = await Promise.all(saveQueue);

    // TODO: remove when integrate API
    // Simulate a delay when saving data to API
    await new Promise(r =>
      setTimeout(() => {
        r();
      }, 300)
    );

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

export default printService;

// TODO: Remove when integrate API
// Temporary helper function
function getSheetsFromStorage() {
  const sheets = {};
  window.data.book.sections.forEach(section => {
    section.sheets.forEach(sheet => (sheets[sheet.id] = sheet));
  });

  return sheets;
}
