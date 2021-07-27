import { STORAGE_KEY } from '@/common/constants';
import { BookDetail, Section, SheetPrintData } from '@/common/models';
import { parseItem, setItem } from '@/common/storage/session.helper';
import { isEmpty } from '@/common/utils';

import books from '@/mock/books';
import layoutData from '@/mock/layouts';
import { PRINT_LAYOUT_TYPES } from '@/mock/layoutTypes';

const bookId = 1719;
const keyBookData = `${STORAGE_KEY.bookStorage}-${bookId}`;
const keyBook = `${STORAGE_KEY.book}-${bookId}`;
const keySection = `${STORAGE_KEY.section}-${bookId}`;
const keySheet = `${STORAGE_KEY.printSheet}-${bookId}`;
const keyObject = `${STORAGE_KEY.object}-${bookId}`;
const keyLayoutPrint = `${STORAGE_KEY.printLayout}`;
const keyLayoutTypePrint = `${STORAGE_KEY.printLayoutType}`;
const keySavedLayoutPrint = `${STORAGE_KEY.printSavedlayout}`;
const keyFavoritesLayoutPrint = `${STORAGE_KEY.printFavoritesLayout}`;

// TODO: remove when integrate with API
const setMockBookDataToStorage = () => {
  // TODO: delete when implemente save data in Digital
  setItem(keyBookData, JSON.stringify(books[1719]));

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

  setItem(keyBook, JSON.stringify(bookDetail));
  setItem(keySection, JSON.stringify(sections));
  setItem(keySheet, JSON.stringify(sheets));
};

/**
 * load data from sessionStorage and save in window.data
 */
const getBookData = () => {
  // check and set mock data to sesstion storage if empty
  setMockBookDataToStorage();

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
};

/**
 * listen for beforeunload event to save data in window.book to sessionStorage
 */
const saveOnUnloadEvent = () => {
  window.addEventListener('beforeunload', () => {
    setItem(keyBook, JSON.stringify(window.data.book));
    setItem(keySection, JSON.stringify(window.data.sections));
    setItem(keySheet, JSON.stringify(window.data.sheets));
    setItem(keyObject, JSON.stringify(window.data.objects));

    setItem(keyLayoutPrint, JSON.stringify(window.data.printLayouts));
    setItem(keySavedLayoutPrint, JSON.stringify(window.data.printSavedLayouts));
    setItem(
      keyFavoritesLayoutPrint,
      JSON.stringify(window.data.printFavoritesLayouts)
    );
  });
};

const setMockLayoutDataToStorage = () => {
  const layouts = window.sessionStorage.getItem(keyLayoutPrint);
  const layoutTypes = window.sessionStorage.getItem(keyLayoutTypePrint);

  if (isEmpty(layouts)) {
    setItem(keyLayoutPrint, JSON.stringify(layoutData));
  }

  if (isEmpty(layoutTypes)) {
    const types = Object.values(PRINT_LAYOUT_TYPES).map(lt => lt);

    setItem(keyLayoutTypePrint, JSON.stringify(types));
  }
};

const getLayoutData = () => {
  // check and set mock data to sesstion storage if empty
  setMockLayoutDataToStorage();

  const printLayouts = parseItem(keyLayoutPrint) || {};
  const printLayoutTypes = parseItem(keyLayoutTypePrint) || [];
  const printSavedLayouts = parseItem(keySavedLayoutPrint) || [];
  const printFavoritesLayouts = parseItem(keyFavoritesLayoutPrint) || [];

  // Save to window.data variable
  window.data.printLayouts = printLayouts;
  window.data.printLayoutTypes = printLayoutTypes;
  window.data.printSavedLayouts = printSavedLayouts;
  window.data.printFavoritesLayouts = printFavoritesLayouts;
};

const initData = () => {
  getBookData();
  getLayoutData();
};

export default {
  setMockBookDataToStorage,
  initData,
  saveOnUnloadEvent
};
