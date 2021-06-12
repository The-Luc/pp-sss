export const MODULE_NAME = 'book';

const _GETTERS = {
  BOOK_DETAIL: 'bookDetail',
  BOOK_ID: 'bookId',
  SECTIONS: 'sections',
  SELECTED_OBJECT_TYPE: 'selectedObjectType',
  IS_OPEN_MENU_PROPERTIES: 'isOpenMenuProperties',
  PRINT_THEME_SELECTED_ID: 'isSelectedPrintTheme',
  BOOK_DATES: 'getBookDates',
  GET_SECTIONS: 'getSections',
  GET_TOTAL_INFO: 'getTotalInfo',
  GET_TOTAL_SECTIONS: 'getTotalSections',
  GET_MAX_PAGE: 'getMaxPage',
  GET_PAGE_SELECTED: 'getPageSelected',
  TOTAL_MONTH_SHOW_ON_CHART: 'totalMonthShowOnChart',
  TOTAL_DAYS_SHOW_ON_CHART: 'totalDayShowOnChart',
  CREATED_DATE_FROM_BEGINNING: 'createdDayFromBeginning',
  SALE_DATE_FROM_BEGINNING: 'saleDayFromBeginning',
  RELEASE_DATE_FROM_BEGINNING: 'releaseDayFromBeginning',
  DELIVERY_DATE_FROM_BEGINNING: 'deliveryDayFromBeginning',
  SHEET_THEME: 'sheetTheme',
  SHEET_LAYOUT: 'sheetLayout',
  SECTION_ID: 'sectionId',
  DUE_DATE_FROM_BEGINNING: 'dueDayFromBeginning',
  SELECTED_OBJECT_ID: 'selectedObjectId',
  OBJECT_BY_ID: 'objectById',
  PROP_OBJECT_BY_ID: 'propertyOfObjectById',
  TRIGGER_TEXT_CHANGE: 'triggerTextChange',
  GET_OBJECTS_BY_SHEET_ID: 'getObjectsBySheetId',
  SHEET_BACKGROUNDS: 'getCurrentBackgroundOfSheet',
  SHEET_TYPE: 'getSheetType'
};

export const GETTERS = {
  SECTIONS: `${MODULE_NAME}/${_GETTERS.SECTIONS}`,
  BOOK_DETAIL: `${MODULE_NAME}/${_GETTERS.BOOK_DETAIL}`,
  BOOK_ID: `${MODULE_NAME}/${_GETTERS.BOOK_ID}`,
  PRINT_THEME_SELECTED_ID: `${MODULE_NAME}/${_GETTERS.PRINT_THEME_SELECTED_ID}`,
  BOOK_DATES: `${MODULE_NAME}/${_GETTERS.BOOK_DATES}`,
  GET_SECTIONS: `${MODULE_NAME}/${_GETTERS.GET_SECTIONS}`,
  GET_TOTAL_INFO: `${MODULE_NAME}/${_GETTERS.GET_TOTAL_INFO}`,
  GET_TOTAL_SECTIONS: `${MODULE_NAME}/${_GETTERS.GET_TOTAL_SECTIONS}`,
  GET_MAX_PAGE: `${MODULE_NAME}/${_GETTERS.GET_MAX_PAGE}`,
  GET_PAGE_SELECTED: `${MODULE_NAME}/${_GETTERS.GET_PAGE_SELECTED}`,
  TOTAL_MONTH_SHOW_ON_CHART: `${MODULE_NAME}/${_GETTERS.TOTAL_MONTH_SHOW_ON_CHART}`,
  TOTAL_DAYS_SHOW_ON_CHART: `${MODULE_NAME}/${_GETTERS.TOTAL_DAYS_SHOW_ON_CHART}`,
  CREATED_DATE_FROM_BEGINNING: `${MODULE_NAME}/${_GETTERS.CREATED_DATE_FROM_BEGINNING}`,
  SALE_DATE_FROM_BEGINNING: `${MODULE_NAME}/${_GETTERS.SALE_DATE_FROM_BEGINNING}`,
  RELEASE_DATE_FROM_BEGINNING: `${MODULE_NAME}/${_GETTERS.RELEASE_DATE_FROM_BEGINNING}`,
  DELIVERY_DATE_FROM_BEGINNING: `${MODULE_NAME}/${_GETTERS.DELIVERY_DATE_FROM_BEGINNING}`,
  SHEET_THEME: `${MODULE_NAME}/${_GETTERS.SHEET_THEME}`,
  SHEET_LAYOUT: `${MODULE_NAME}/${_GETTERS.SHEET_LAYOUT}`,
  SECTION_ID: `${MODULE_NAME}/${_GETTERS.SECTION_ID}`,
  DUE_DATE_FROM_BEGINNING: `${MODULE_NAME}/${_GETTERS.DUE_DATE_FROM_BEGINNING}`,
  SELECTED_OBJECT_ID: `${MODULE_NAME}/${_GETTERS.SELECTED_OBJECT_ID}`,
  OBJECT_BY_ID: `${MODULE_NAME}/${_GETTERS.OBJECT_BY_ID}`,
  PROP_OBJECT_BY_ID: `${MODULE_NAME}/${_GETTERS.PROP_OBJECT_BY_ID}`,
  TRIGGER_TEXT_CHANGE: `${MODULE_NAME}/${_GETTERS.TRIGGER_TEXT_CHANGE}`,
  GET_OBJECTS_BY_SHEET_ID: `${MODULE_NAME}/${_GETTERS.GET_OBJECTS_BY_SHEET_ID}`,
  SHEET_BACKGROUNDS: `${MODULE_NAME}/${_GETTERS.SHEET_BACKGROUNDS}`,
  SHEET_TYPE: `${MODULE_NAME}/${_GETTERS.SHEET_TYPE}`
};

const _ACTIONS = {
  GET_BOOK: 'getBook'
};

export const ACTIONS = {
  GET_BOOK: `${MODULE_NAME}/${_ACTIONS.GET_BOOK}`
};

const _MUTATES = {
  UPDATE_SECTIONS: 'updateSections',
  UPDATE_SECTION_POSITION: 'updateSectionPosition',
  UPDATE_SHEETS: 'updateSheets',
  UPDATE_SHEET_POSITION: 'updateSheetPosition',
  GET_BOOK_SUCCESS: 'getBookSuccess',
  ADD_SHEET: 'addSheet',
  DELETE_SECTION: 'deleteSection',
  DELETE_SHEET: 'deleteSheet',
  MOVE_SHEET: 'moveSheet',
  ADD_SECTION: 'addSection',
  EDIT_SECTION_NAME: 'editSectionName',
  SELECT_SHEET: 'selectSheet',
  SELECT_THEME: 'selectTheme',
  TEXT_PROPERTIES: 'textProperties',
  UPDATE_SHEET_THEME_LAYOUT: 'updateSheetThemeLayout',
  UPDATE_SHEET_VISITED: 'updateSheetVisited',
  SET_SECTION_ID: 'setSectionId',
  SAVE_PRINT_CANVAS: 'savePrintCanvas',
  SET_SELECTED_OBJECT_ID: 'setSelectedObjectId',
  SET_PROP: 'setProperty',
  ADD_OBJECT: 'addNewObject',
  ADD_BACKGROUND: 'addNewBackground',
  UPDATE_TRIGGER_TEXT_CHANGE: 'updateTriggerTextChange'
};

export const MUTATES = {
  GET_BOOK_SUCCESS: `${MODULE_NAME}/${_MUTATES.GET_BOOK_SUCCESS}`,
  UPDATE_SECTIONS: `${MODULE_NAME}/${_MUTATES.UPDATE_SECTIONS}`,
  UPDATE_SECTION_POSITION: `${MODULE_NAME}/${_MUTATES.UPDATE_SECTION_POSITION}`,
  UPDATE_SHEETS: `${MODULE_NAME}/${_MUTATES.UPDATE_SHEETS}`,
  UPDATE_SHEET_POSITION: `${MODULE_NAME}/${_MUTATES.UPDATE_SHEET_POSITION}`,
  SECTIONS: `${MODULE_NAME}/${_GETTERS.SECTIONS}`,
  BOOK_DETAIL: `${MODULE_NAME}/${_GETTERS.BOOK_DETAIL}`,
  BOOK_ID: `${MODULE_NAME}/${_GETTERS.BOOK_ID}`,
  ADD_SHEET: `${MODULE_NAME}/${_MUTATES.ADD_SHEET}`,
  DELETE_SECTION: `${MODULE_NAME}/${_MUTATES.DELETE_SECTION}`,
  DELETE_SHEET: `${MODULE_NAME}/${_MUTATES.DELETE_SHEET}`,
  MOVE_SHEET: `${MODULE_NAME}/${_MUTATES.MOVE_SHEET}`,
  ADD_SECTION: `${MODULE_NAME}/${_MUTATES.ADD_SECTION}`,
  EDIT_SECTION_NAME: `${MODULE_NAME}/${_MUTATES.EDIT_SECTION_NAME}`,
  SELECT_SHEET: `${MODULE_NAME}/${_MUTATES.SELECT_SHEET}`,
  SELECT_THEME: `${MODULE_NAME}/${_MUTATES.SELECT_THEME}`,
  TEXT_PROPERTIES: `${MODULE_NAME}/${_MUTATES.TEXT_PROPERTIES}`,
  UPDATE_SHEET_THEME_LAYOUT: `${MODULE_NAME}/${_MUTATES.UPDATE_SHEET_THEME_LAYOUT}`,
  UPDATE_SHEET_VISITED: `${MODULE_NAME}/${_MUTATES.UPDATE_SHEET_VISITED}`,
  SET_SECTION_ID: `${MODULE_NAME}/${_MUTATES.SET_SECTION_ID}`,
  SAVE_PRINT_CANVAS: `${MODULE_NAME}/${_MUTATES.SAVE_PRINT_CANVAS}`,
  SET_SELECTED_OBJECT_ID: `${MODULE_NAME}/${_MUTATES.SET_SELECTED_OBJECT_ID}`,
  SET_PROP: `${MODULE_NAME}/${_MUTATES.SET_PROP}`,
  ADD_OBJECT: `${MODULE_NAME}/${_MUTATES.ADD_OBJECT}`,
  UPDATE_TRIGGER_TEXT_CHANGE: `${MODULE_NAME}/${_MUTATES.UPDATE_TRIGGER_TEXT_CHANGE}`,
  ADD_BACKGROUND: `${MODULE_NAME}/${_MUTATES.ADD_BACKGROUND}`
};

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
