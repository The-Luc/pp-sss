import { BookDetail, Section, Sheet } from '@/common/models';

import { isEmpty } from '@/common/utils';

/**
 * Temporary code, will be replaced when integrating with API
 */
export const getBookApi = bookId => {
  return new Promise(resolve => {
    const book = JSON.parse(window.sessionStorage.getItem(`book-${bookId}`));
    const coverType = window.sessionStorage.getItem('bookCoverType');
    const maxPage = window.sessionStorage.getItem('bookMaxPage');

    delete book.printData;
    delete book.digitalData;

    if (!isEmpty(coverType)) book.coverOption = coverType;

    if (!isEmpty(maxPage)) book.numberMaxPages = parseInt(maxPage, 10);

    const sectionIds = [];
    const sections = {};
    const sheets = {};

    book.sections.forEach(section => {
      const sheetIds = [];

      section.sheets.forEach(sheet => {
        const { id } = sheet;

        delete sheet.printData;
        delete sheet.digitalData;

        sheets[id] = new Sheet(sheet);

        sheetIds.push(id);
      });

      const { id } = section;

      section.sheetIds = sheetIds;

      sections[id] = new Section(section);

      sectionIds.push(id);
    });

    resolve({
      book: new BookDetail(book),
      sectionIds,
      sections,
      sheets
    });
  });
};

export default {
  getBook: getBookApi
};
