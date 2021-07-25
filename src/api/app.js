import { STORAGE_KEY } from '@/common/constants';
import { BookDetail, Section, SheetPrintData } from '@/common/models';
import { parseItem, setItem } from '@/common/storage/session.helper';
import { isEmpty } from '@/common/utils';
import books from '@/mock/books';

const bookId = 1719;
const keyBookData = `${STORAGE_KEY.bookStorage}-${bookId}`;
const keyBook = `${STORAGE_KEY.book}-${bookId}`;
const keySection = `${STORAGE_KEY.section}-${bookId}`;
const keySheet = `${STORAGE_KEY.printSheet}-${bookId}`;
const keyObject = `${STORAGE_KEY.object}-${bookId}`;

const appService = {
  // TODO: remove when integrate with API
  setMockBookDataToStorage() {
    // TODO: delete when implemente save data in Digital
    window.sessionStorage.setItem(keyBookData, JSON.stringify(books[1719]));

    const book = window.sessionStorage.getItem(keyBook);

    if (!isEmpty(book)) return;

    const bookDetail = new BookDetail(books[1719]);

    const sections = [];
    const sheets = [];

    books[1719].sections.forEach(section => {
      const sheetIds = [];

      section.sheets.forEach(sheet => {
        // TODO: use general Sheet Class here
        sheets.push(
          new SheetPrintData({
            ...sheet,
            sectionId: section.id,
            link: sheet.printData.link
          })
        );

        sheetIds.push(sheet.id);
      });

      section.sheetIds = sheetIds;

      sections.push(new Section(section));
    });

    window.sessionStorage.setItem(keyBook, JSON.stringify(bookDetail));
    window.sessionStorage.setItem(keySection, JSON.stringify(sections));
    window.sessionStorage.setItem(keySheet, JSON.stringify(sheets));
  },
  /**
   * load data from sessionStorage and save in window.data
   */
  getBookData() {
    // check and set mock data to sesstion storage if empty
    appService.setMockBookDataToStorage();

    const bookDetail = parseItem(keyBook) || {};
    const sections = parseItem(keySection) || [];
    const sheets = parseItem(keySheet) || [];
    const objects = parseItem(keyObject) || {};

    const sheetsData = sheets.map(sheet => new SheetPrintData(sheet));
    const sectionsData = sections.map(s => new Section(s));

    // Save to window.data variable
    window.data = {};
    window.data.book = new BookDetail(bookDetail);
    window.data.sections = sectionsData;
    window.data.sheets = sheetsData;
    window.data.objects = objects;
  },
  /**
   * listen for beforeunload event to save data in window.book to sessionStorage
   */
  saveOnUnloadEvent() {
    window.addEventListener('beforeunload', function() {
      setItem(keyBook, JSON.stringify(window.data.book));
      setItem(keySection, JSON.stringify(window.data.sections));
      setItem(keySheet, JSON.stringify(window.data.sheets));
      setItem(keyObject, JSON.stringify(window.data.objects));
    });
  }
};

export default appService;
