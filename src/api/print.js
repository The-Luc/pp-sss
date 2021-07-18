import { getSuccessWithData, getErrorWithMessages } from '@/common/models';

import { isEmpty, getPageLeftName, getPageRightName } from '@/common/utils';

const printService = {
  /**
   * Get default theme id book
   *
   * @param   {Number}  bookId  id of current book
   * @returns {Object}          query result
   */
  getDefaultThemeId: bookId => {
    return new Promise(resolve => {
      const book = JSON.parse(window.sessionStorage.getItem(`book-${bookId}`));
      const data = book.printData.themeId;

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
      let totalSheets = 0;

      const book = JSON.parse(window.sessionStorage.getItem(`book-${bookId}`));

      const data = book.sections.map((section, sectionIndex) => {
        const sheets = section.sheets.map((sheet, sheetIndex) => {
          const { id, type } = sheet;
          const { thumbnailUrl, link } = sheet.printData;

          const pageLeftName = getPageLeftName(sheet, sheetIndex, totalSheets);
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

        const { name, color, id } = section;

        return { id, name, color, sheets };
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
      let totalSheets = 0;

      const book = JSON.parse(window.sessionStorage.getItem(`book-${bookId}`));
      const coverType = window.sessionStorage.getItem('bookCoverType');
      const maxPage = window.sessionStorage.getItem('bookMaxPage');

      if (!isEmpty(coverType)) book.coverOption = coverType;

      if (!isEmpty(maxPage)) book.numberMaxPages = parseInt(maxPage, 10);

      const data = book.sections.map((section, sectionIndex) => {
        const sheets = section.sheets.map((sheet, sheetIndex) => {
          const { id, type, isVisited } = sheet;
          const {
            link,
            thumbnailUrl,
            theme: themeId,
            layout,
            spreadInfo
          } = sheet.printData;
          const pageLeftName = getPageLeftName(sheet, sheetIndex, totalSheets);
          const pageRightName = getPageRightName(
            sheet,
            sheetIndex,
            totalSheets
          );

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
      // load the canvas from sessionStorage if exist
      const storageData = window.sessionStorage.getItem(`SHEET_ID_${sheetId}`);

      if (!isEmpty(storageData)) {
        resolve(getSuccessWithData(JSON.parse(storageData)));

        return;
      }

      const book = JSON.parse(window.sessionStorage.getItem(`book-${bookId}`));

      const section = book.sections.find(s => sectionId === s.id);

      if (isEmpty(section)) return {};

      const sheet = section.sheets.find(s => sheetId === s.id);

      const data = sheet?.printData?.objects || [];

      const result = isEmpty(data)
        ? getErrorWithMessages([])
        : getSuccessWithData(data);

      resolve(result);
    });
  },

  /**
   * to save state of the canvas to sessionStorage
   * @param {Number} Id of the active sheet
   * @param {Object} sheetLayout objects on canvas that will be save on the storage
   */
  saveCanvasState: (sheetId, sheetLayout) => {
    // sheetId is undefined when load the page the first time
    if (!sheetId) return;

    window.sessionStorage.setItem(
      `SHEET_ID_${sheetId}`,
      JSON.stringify(sheetLayout)
    );
  },
  /**
   * Get print page info
   *
   * @param   {Number}  bookId  id of current book
   * @returns {Object}          query result
   */
  getPageInfo: bookId => {
    return new Promise(resolve => {
      const book = JSON.parse(window.sessionStorage.getItem(`book-${bookId}`));
      const data = book.printData.pageInfo;
      const result = isEmpty(data)
        ? getErrorWithMessages([])
        : getSuccessWithData({ ...data });

      resolve(result);
    });
  }
};

export default printService;
