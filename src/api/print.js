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
        const { id, type, thumbnailUrl, link } = sheet;

        const pageLeftName = getPageLeftName(sheet, sheetIndex, totalSheets);
        const pageRightName = getPageRightName(sheet, sheetIndex, totalSheets);

        return {
          id,
          type,
          thumbnailUrl,
          link,
          pageLeftName,
          pageRightName
        };
      });

      if (sectionIndex > 0) {
        totalSheets += section.sheetIds.length;
      }

      const { name, color, id } = section;

      return { id, name, color, sheets };
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

        const { id, type, isVisited } = sheet;
        const {
          link,
          thumbnailUrl,
          theme: themeId,
          layout,
          spreadInfo
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
          layoutId: layout?.id || null,
          pageLeftName,
          pageRightName,
          spreadInfo: { ...spreadInfo }
        };
      });

      if (sectionIndex > 0) {
        totalSheets += section.sheetIds.length;
      }

      const { name, color } = section;

      return { id: section.id, name, color, sheets };
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
  getSheetObjects: (bookId, sectionId, sheetId) => {
    return new Promise(resolve => {
      // TODO -Luc: Will be implemente very soon

      // const sheets = window.data.sheets;

      // const objects = sheets[sheetId].objects.map(o => ({
      //   ...o.object,
      //   id: o.id
      // }));

      // const data = objects || [];
      // const result = isEmpty(data)
      //   ? getErrorWithMessages([])
      //   : getSuccessWithData(data);

      resolve([]);
    });
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

      const sheet = window.data.sheets.find(s => s.id === sheetId);
      sheet._set(props);

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
      const sheet = window.data.sheets[sheetId];

      sheet.spreadInfo = { ...sheet.spreadInfo, ...spreadInfo };
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
   * to save sheet link status
   */
  saveObjectsAndBackground: (sheetId, data) => {
    return printService.updateSheet(sheetId, { objects: data });
  },

  /**
   * save sheet's thumbnail
   */
  saveSheetThumbnail: (sheetId, thumbnailUrl) => {
    return printService.updateSheet(sheetId, { thumbnailUrl });
  }
};

export default printService;
