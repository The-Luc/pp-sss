import { getSuccessWithData, getErrorWithMessages } from '@/common/models';

import { isEmpty, getPageLeftName, getPageRightName } from '@/common/utils';

import bookService from './book';

const digitalService = {
  /**
   * Get default theme id book
   *
   * @param   {Number}  bookId  id of current book
   * @returns {Object}          query result
   */
  getDefaultThemeId: bookId => {
    return new Promise(resolve => {
      const data = bookService.getBook(bookId).digitalData.themeId;

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
  geDigitalSectionsSheets: bookId => {
    return new Promise(resolve => {
      let totalSheets = 0;

      const data = bookService
        .getBook(bookId)
        .sections.map((section, sectionIndex) => {
          const sheets = section.sheets.map((sheet, sheetIndex) => {
            const { id, type } = sheet;
            const { thumbnailUrl, link } = sheet.digitalData;

            const pageLeftName = getPageLeftName(
              sheet,
              sheetIndex,
              totalSheets
            );
            const pageRightName = getPageRightName(
              sheet,
              sheetIndex,
              totalSheets
            );

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
            totalSheets += section.sheets.length;
          }

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
  getDigitalEditSectionsSheets: bookId => {
    return new Promise(resolve => {
      let totalSheets = 0;

      const data = bookService
        .getBook(bookId)
        .sections.map((section, sectionIndex) => {
          const sheets = section.sheets.map((sheet, sheetIndex) => {
            const { id, type, isVisited } = sheet;
            const { thumbnailUrl, theme: themeId, layout } = sheet.digitalData;

            const pageLeftName = getPageLeftName(
              sheet,
              sheetIndex,
              totalSheets
            );
            const pageRightName = getPageRightName(
              sheet,
              sheetIndex,
              totalSheets
            );

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

          if (sectionIndex > 0) {
            totalSheets += section.sheets.length;
          }

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

      const data = sheet?.digitalData?.objects || [];

      const result = isEmpty(data)
        ? getErrorWithMessages([])
        : getSuccessWithData(data);

      resolve(result);
    });
  }
};

export default digitalService;
