import { BaseObject } from '@/common/models';
import { prefixObjectValue } from '@/common/utils';

export const MODULE_NAME = 'book';

class GetterClass extends BaseObject {
  BOOK_DETAIL = 'bookDetail';
  BOOK_ID = 'bookId';
  SECTIONS = 'sections';
  SELECTED_OBJECT_TYPE = 'selectedObjectType';
  PRINT_THEME_SELECTED_ID = 'isSelectedPrintTheme';
  BOOK_DATES = 'getBookDates';
  GET_SECTIONS = 'getSections';
  GET_TOTAL_INFO = 'getTotalInfo';
  GET_TOTAL_SECTIONS = 'getTotalSections';
  GET_MAX_PAGE = 'getMaxPage';
  TOTAL_MONTH_SHOW_ON_CHART = 'totalMonthShowOnChart';
  TOTAL_DAYS_SHOW_ON_CHART = 'totalDayShowOnChart';
  CREATED_DATE_FROM_BEGINNING = 'createdDayFromBeginning';
  SALE_DATE_FROM_BEGINNING = 'saleDayFromBeginning';
  RELEASE_DATE_FROM_BEGINNING = 'releaseDayFromBeginning';
  DELIVERY_DATE_FROM_BEGINNING = 'deliveryDayFromBeginning';
  SHEET_THEME = 'sheetTheme';
  SECTION_ID = 'sectionId';
  DUE_DATE_FROM_BEGINNING = 'dueDayFromBeginning';

  constructor(props) {
    super(props);
    this._set(props);
  }
}

const _GETTERS = new GetterClass();

export const GETTERS = new GetterClass(
  prefixObjectValue(_GETTERS, MODULE_NAME)
);

class ActionClass extends BaseObject {
  GET_BOOK = 'getBook';

  constructor(props) {
    super(props);
    this._set(props);
  }
}
const _ACTIONS = new ActionClass();

export const ACTIONS = new ActionClass(
  prefixObjectValue(_ACTIONS, MODULE_NAME)
);

class MutationClass extends BaseObject {
  UPDATE_SECTIONS = 'updateSections';
  UPDATE_SECTION_POSITION = 'updateSectionPosition';
  UPDATE_SHEETS = 'updateSheets';
  UPDATE_SHEET_POSITION = 'updateSheetPosition';
  GET_BOOK_SUCCESS = 'getBookSuccess';
  ADD_SHEET = 'addSheet';
  DELETE_SECTION = 'deleteSection';
  DELETE_SHEET = 'deleteSheet';
  MOVE_SHEET = 'moveSheet';
  ADD_SECTION = 'addSection';
  EDIT_SECTION_NAME = 'editSectionName';
  SELECT_THEME = 'selectTheme';
  SET_SECTION_ID = 'setSectionId';
  SET_BOOK_ID = 'setBookId';
  SET_BOOK = 'setBook';
  SET_SECTIONS = 'setSections';
  SET_SHEETS = 'setSheets';

  constructor(props) {
    super(props);
    this._set(props);
  }
}

const _MUTATES = new MutationClass();

export const MUTATES = new MutationClass(
  prefixObjectValue(_MUTATES, MODULE_NAME)
);

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
