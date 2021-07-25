import { STORAGE_KEY } from '@/common/constants';
import { BookDetail, Section, SheetPrintData } from '@/common/models';
import { parseItem, setItem } from '@/common/storage/session.helper';
import { isEmpty } from '@/common/utils';

import books from '@/mock/books';
import layoutData from '@/mock/layouts';
import { LAYOUT_TYPES } from '@/mock/layoutTypes';

const bookId = 1719;
const keyBookData = `${STORAGE_KEY.bookStorage}-${bookId}`;
const keyBook = `${STORAGE_KEY.book}-${bookId}`;
const keySection = `${STORAGE_KEY.section}-${bookId}`;
const keySheet = `${STORAGE_KEY.printSheet}-${bookId}`;
const keyLayout = `${STORAGE_KEY.layout}`;
const keyLayoutType = `${STORAGE_KEY.layoutType}`;

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

  let bookDetail = parseItem(keyBook) || {};
  let sections = parseItem(keySection) || [];
  let sheets = parseItem(keySheet) || [];

  const sheetsData = sheets.map(sheet => new SheetPrintData(sheet));
  const sectionsData = sections.map(s => new Section(s));

  // Save to window.data variable
  window.data = {};
  window.data.book = new BookDetail(bookDetail);
  window.data.sections = sectionsData;
  window.data.sheets = sheetsData;
};

/**
 * listen for beforeunload event to save data in window.book to sessionStorage
 */
const saveOnUnloadEvent = () => {
  window.addEventListener('beforeunload', () => {
    setItem(keyBook, JSON.stringify(window.data.book));
    setItem(keySection, JSON.stringify(window.data.sections));
    setItem(keySheet, JSON.stringify(window.data.sheets));
    setItem(keyLayout, JSON.stringify(window.data.layouts));
  });
};

const setMockLayoutDataToStorage = () => {
  const layouts = window.sessionStorage.getItem(keyLayout);
  const layoutTypes = window.sessionStorage.getItem(keyLayoutType);

  if (isEmpty(layouts)) {
    setItem(keyLayout, JSON.stringify(layoutData));
  }

  if (isEmpty(layoutTypes)) {
    setItem(keyLayoutType, JSON.stringify(LAYOUT_TYPES));
  }
};

const getLayoutData = () => {
  // check and set mock data to sesstion storage if empty
  setMockLayoutDataToStorage();

  const layouts = parseItem(keyLayout) || {};
  const layoutTypes = parseItem(keyLayoutType) || [];
  console.log(layoutTypes);

  // Save to window.data variable
  window.data.layouts = layouts;
  window.data.layoutTypes = layoutTypes;
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
