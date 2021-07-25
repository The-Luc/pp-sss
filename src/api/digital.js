import { getSuccessWithData, getErrorWithMessages } from '@/common/models';

import { isEmpty, getPageName } from '@/common/utils';

const digitalService = {
  /**
   * Get default theme id book
   *
   * @param   {Number}  bookId  id of current book
   * @returns {Object}          query result
   */
  getDefaultThemeId: bookId => {
    return new Promise(resolve => {
      const book = JSON.parse(window.sessionStorage.getItem(`book-${bookId}`));
      const data = book.digitalData.themeId;

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
  getDigitalSectionsSheets: bookId => {
    let totalSheets = 0;

    return new Promise(resolve => {
      const book = JSON.parse(window.sessionStorage.getItem(`book-${bookId}`));

      const data = book.sections.map(section => {
        const sheets = section.sheets.map((sheet, sheetIndex) => {
          const {
            id,
            type,
            digitalData: { thumbnailUrl, link }
          } = sheet;

          const pageName = getPageName(sheetIndex, totalSheets);

          return {
            id,
            type,
            thumbnailUrl,
            link,
            pageName
          };
        });

        totalSheets += section.sheets.length;

        const { name, color, assigneeId } = section;

        return { name, color, assigneeId, sheets };
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
    let totalSheets = 0;

    return new Promise(resolve => {
      const book = JSON.parse(window.sessionStorage.getItem(`book-${bookId}`));
      const coverType = window.sessionStorage.getItem('bookCoverType');
      const maxPage = window.sessionStorage.getItem('bookMaxPage');

      if (!isEmpty(coverType)) book.coverOption = coverType;

      if (!isEmpty(maxPage)) book.numberMaxPages = parseInt(maxPage, 10);

      const data = book.sections.map(section => {
        const sheets = section.sheets.map((sheet, sheetIndex) => {
          const { id, type, isVisited } = sheet;
          const { thumbnailUrl, theme: themeId, layout } = sheet.digitalData;

          const pageName = getPageName(sheetIndex, totalSheets);

          return {
            id,
            type,
            thumbnailUrl,
            isVisited,
            themeId,
            layoutId: layout?.id || null,
            pageName
          };
        });

        totalSheets += section.sheets.length;

        const { name, color, assigneeId } = section;

        return { id: section.id, name, color, assigneeId, sheets };
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
      const book = JSON.parse(window.sessionStorage.getItem(`book-${bookId}`));

      const section = book.sections.find(s => sectionId === s.id);

      if (isEmpty(section)) return {};

      const sheet = section.sheets.find(s => sheetId === s.id);

      const data = sheet?.digitalData?.objects || [];

      const result = isEmpty(data)
        ? getErrorWithMessages([])
        : getSuccessWithData(data);

      resolve(result);
    });
  },
  // temporary code, will remove soon
  getGeneralInfo: () => {
    const { title, totalSheets, totalPages, totalScreens } = JSON.parse(
      window.sessionStorage.getItem('book-1719')
    );

    return {
      title,
      totalSheet: totalSheets,
      totalPage: totalPages,
      totalScreen: totalScreens
    };
  }
};

export default digitalService;
