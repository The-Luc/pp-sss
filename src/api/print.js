import { getSuccessWithData, getErrorWithMessages } from '@/common/models';

import { isEmpty } from '@/common/utils';

import bookService from './book';

const printService = {
  /**
   * Get default theme id book
   *
   * @param   {Number}  bookId  id of current book
   * @returns {Object}          query result
   */
  getDefaultThemeId: bookId => {
    return new Promise(resolve => {
      const data = bookService.getBook(bookId).printData.themeId;

      const result = isEmpty(data)
        ? getErrorWithMessages([])
        : getSuccessWithData(data);

      resolve(result);
    });
  },
  /**
   * Get list of section & sheets inside each section
   * use in main page
   *
   * @param   {Number}  bookId  id of current book
   * @returns {Object}          query result
   */
  getPrintSectionsSheets: bookId => {
    return new Promise(resolve => {
      const data = bookService.getBook(bookId).sections.map(section => {
        const sheets = section.sheets.map(sheet => {
          const { id, type, thumbnailUrl, link } = sheet;

          const pageLeftName = '';
          const pageRightName = '';

          return {
            id,
            type,
            thumbnailUrl,
            link,
            pageLeftName,
            pageRightName
          };
        });

        const { name, color } = section;

        return { name, color, sheets: sheets };
      });

      const result = isEmpty(data)
        ? getErrorWithMessages([])
        : getSuccessWithData(data);

      resolve(result);
    });
  },
  /**
   * Get list of section & sheets inside each section
   * use in page edit
   *
   * @param   {Number}  bookId  id of current book
   * @returns {Object}          query result
   */
  getPrintEditSectionsSheets: bookId => {
    return new Promise(resolve => {
      const data = bookService.getBook(bookId).sections.map(section => {
        const sheets = section.sheets.map(sheet => {
          const { id, type, isVisited } = sheet;
          const { thumbnailUrl, theme: themeId, layout } = sheet.printData;
          const pageLeftName = '';
          const pageRightName = '';

          return {
            id,
            type,
            thumbnailUrl,
            isVisited,
            themeId,
            layoutId: layout?.id || null,
            pageLeftName,
            pageRightName
          };
        });

        const { name, color } = section;

        return { id: section.id, name, color, sheets: sheets };
      });

      const result = isEmpty(data)
        ? getErrorWithMessages([])
        : getSuccessWithData(data);

      resolve(result);
    });
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
      const section = bookService
        .getBook(bookId)
        .sections.find(s => sectionId === s.id);

      if (isEmpty(section)) return {};

      const sheet = section.sheets.find(s => sheetId === s.id);

      const data = sheet?.printData?.objects || [];

      const result = isEmpty(data)
        ? getErrorWithMessages([])
        : getSuccessWithData(data);

      resolve(result);
    });
  }
};

export default printService;
