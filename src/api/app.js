import { STORAGE_KEY } from '@/common/constants';
import {
  BookDetailEntity,
  SectionEntity,
  SheetEntity
} from '@/common/models/entities';
import { getItem, parseItem, setItem } from '@/common/storage/session.helper';
import { isEmpty } from '@/common/utils';

import books from '@/mock/books';
import layoutData from '@/mock/layouts';
import digitalLayoutData from '@/mock/digitalLayouts';
import { PRINT_LAYOUT_TYPES, DIGITAL_LAYOUT_TYPES } from '@/mock/layoutTypes';

const bookId = 1719;
const keyBook = `${STORAGE_KEY.book}-${bookId}`;

const keyLayoutPrint = `${STORAGE_KEY.printLayout}`;
const keyLayoutTypePrint = `${STORAGE_KEY.printLayoutType}`;
const keyLayoutDigital = `${STORAGE_KEY.digitalLayout}`;
const keyLayoutTypeDigital = `${STORAGE_KEY.digitalLayoutType}`;
const keySavedLayoutPrint = `${STORAGE_KEY.printSavedlayout}`;
const keyFavoritesLayoutPrint = `${STORAGE_KEY.printFavoritesLayout}`;

// TODO: remove when integrate with API
const setMockBookDataToStorage = () => {
  const book = window.sessionStorage.getItem(keyBook);

  if (!isEmpty(book)) return;

  const bookDetail = new BookDetailEntity(books[1719]);

  const sections = [];

  bookDetail.sections.forEach(section => {
    const sheets = [];

    section.sheets.forEach(sheet => {
      sheets.push(
        new SheetEntity({
          ...sheet,
          sectionId: section.id
        })
      );
    });

    section.sheets = sheets;
    sections.push(new SectionEntity(section));
  });

  setItem(keyBook, JSON.stringify(bookDetail));
};

/**
 * load data from sessionStorage and save in window.data
 */
const getBookData = () => {
  // check and set mock data to sesstion storage if empty
  setMockBookDataToStorage();

  const bookDetail = parseItem(keyBook) || {};

  const sections = [];

  bookDetail.sections.forEach(s => {
    s.sheets = s.sheets.map(sheet => new SheetEntity(sheet));

    sections.push(new SectionEntity(s));
  });

  bookDetail.sections = sections;

  // Save to window.data variable
  window.data = {};
  window.data.book = new BookDetailEntity(bookDetail);
};

/**
 * listen for beforeunload event to save data in window.book to sessionStorage
 */
const saveOnUnloadEvent = () => {
  window.addEventListener('beforeunload', () => {
    setItem(keyBook, JSON.stringify(window.data.book));

    setItem(keyLayoutPrint, JSON.stringify(window.data.printLayouts));
    setItem(keySavedLayoutPrint, JSON.stringify(window.data.printSavedLayouts));

    setItem(keyLayoutDigital, JSON.stringify(window.data.digitalLayouts));

    setItem(
      keyFavoritesLayoutPrint,
      JSON.stringify(window.data.printFavoritesLayouts)
    );
  });
};

const setMockLayoutDataToStorage = () => {
  const layouts = getItem(keyLayoutPrint);
  const layoutTypes = getItem(keyLayoutTypePrint);

  const digitalLayouts = getItem(keyLayoutDigital);
  const digitalLayoutTypes = getItem(keyLayoutTypeDigital);

  if (isEmpty(layouts)) {
    setItem(keyLayoutPrint, JSON.stringify(layoutData));
  }

  if (isEmpty(layoutTypes)) {
    const types = Object.values(PRINT_LAYOUT_TYPES).map(lt => lt);

    setItem(keyLayoutTypePrint, JSON.stringify(types));
  }

  if (isEmpty(digitalLayouts)) {
    setItem(keyLayoutDigital, JSON.stringify(digitalLayoutData));
  }

  if (isEmpty(digitalLayoutTypes)) {
    const types = Object.values(DIGITAL_LAYOUT_TYPES).map(lt => lt);

    setItem(keyLayoutTypeDigital, JSON.stringify(types));
  }
};

const getLayoutData = () => {
  // check and set mock data to sesstion storage if empty
  setMockLayoutDataToStorage();

  const printLayouts = parseItem(keyLayoutPrint) || {};
  const printLayoutTypes = parseItem(keyLayoutTypePrint) || [];
  const printSavedLayouts = parseItem(keySavedLayoutPrint) || [];
  const printFavoritesLayouts = parseItem(keyFavoritesLayoutPrint) || [];

  const digitalLayouts = parseItem(keyLayoutDigital) || {};
  const digitalLayoutTypes = parseItem(keyLayoutTypeDigital) || [];

  // Save to window.data variable
  window.data.printLayouts = printLayouts;
  window.data.printLayoutTypes = printLayoutTypes;
  window.data.printSavedLayouts = printSavedLayouts;
  window.data.printFavoritesLayouts = printFavoritesLayouts;

  window.data.digitalLayouts = digitalLayouts;
  window.data.digitalLayoutTypes = digitalLayoutTypes;
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
