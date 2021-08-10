import { STORAGE_KEY } from '@/common/constants';
import {
  BookDetailEntity,
  SectionEntity,
  SheetEntity
} from '@/common/models/entities';
import { parseItem, setItem } from '@/common/storage/session.helper';
import { isEmpty } from '@/common/utils';

import books from '@/mock/books';
import layoutData from '@/mock/layouts';
import { PRINT_LAYOUT_TYPES } from '@/mock/layoutTypes';
import { cloneDeep } from 'lodash';

const bookId = 1719;
const keyBook = `${STORAGE_KEY.book}-${bookId}`;
const keyLayoutPrint = `${STORAGE_KEY.printLayout}`;
const keyLayoutTypePrint = `${STORAGE_KEY.printLayoutType}`;
const keySavedLayoutPrint = `${STORAGE_KEY.printSavedlayout}`;
const keyFavoritesLayoutPrint = `${STORAGE_KEY.printFavoritesLayout}`;
const keyApp = `${STORAGE_KEY.app}`;

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
    setItem(
      keyFavoritesLayoutPrint,
      JSON.stringify(window.data.printFavoritesLayouts)
    );
    setItem(keyApp, JSON.stringify(window.data.app));
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

const setMockAppDataToStorage = () => {
  const app = window.sessionStorage.getItem(keyApp);

  if (!isEmpty(app)) return;

  const appDetail = {
    isPhotoVisited: false
  };

  setItem(keyApp, JSON.stringify(appDetail));
};

const getAppData = () => {
  setMockAppDataToStorage();

  const appDetail = parseItem(keyApp) || {};

  window.data.app = appDetail;
};

export const getAppDetail = () => {
  return new Promise(resolve => {
    const { app } = cloneDeep(window.data);
    const isPhotoVisited = app.isPhotoVisited;

    resolve({
      isPhotoVisited
    });
  });
};

export const setIsPhotoVisited = isPhotoVisited => {
  setTimeout(() => {
    window.data.app.isPhotoVisited = isPhotoVisited;
  });
};

const initData = () => {
  getBookData();
  getLayoutData();
  getAppData();
};

export default {
  setMockBookDataToStorage,
  initData,
  saveOnUnloadEvent,
  getAppDetail,
  setIsPhotoVisited
};
