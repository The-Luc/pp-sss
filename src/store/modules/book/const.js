import { BaseObject } from '@/common/models';
import { prefixObjectValue } from '@/common/utils';

export const MODULE_NAME = 'book';

class GetterClass extends BaseObject {
  BOOK_DETAIL = 'bookDetail';
  BOOK_ID = 'bookId';
  SECTIONS = 'sections';
  SELECTED_OBJECT_TYPE = 'selectedObjectType';
  BOOK_DATES = 'getBookDates';
  SECTIONS_NO_SHEET = 'getSectionsWithoutSheet';
  TOTAL_INFO = 'getTotalInfo';
  TOTAL_SECTION = 'getTotalSections';
  GET_MAX_PAGE = 'getMaxPage';
  TOTAL_MONTH_SHOW_ON_CHART = 'totalMonthShowOnChart';
  TOTAL_DAYS_SHOW_ON_CHART = 'totalDayShowOnChart';
  CREATED_DATE_FROM_BEGINNING = 'createdDayFromBeginning';
  SALE_DATE_FROM_BEGINNING = 'saleDayFromBeginning';
  RELEASE_DATE_FROM_BEGINNING = 'releaseDayFromBeginning';
  DELIVERY_DATE_FROM_BEGINNING = 'deliveryDayFromBeginning';
  DUE_DATE_FROM_BEGINNING = 'dueDayFromBeginning';
  IMPORTANT_DATES_INFO = 'getImportantDatesInfo';
  SPECIFICATION_INFO = 'getSpecificationInfo';
  SALE_INFO = 'getSaleInfo';
  COLORS = 'getCurrentColors';
  SECTION_IDS = 'getSectionIds';

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
  UPDATE_ASSIGNEE = 'updateAssignee';

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
  UPDATE_SECTION = 'updateSection';
  MOVE_SECTION = 'moveSection';
  UPDATE_SHEETS = 'updateSheets';
  MOVE_SHEET = 'moveSheet';
  GET_BOOK_SUCCESS = 'getBookSuccess';
  ADD_SHEET = 'addSheet';
  DELETE_SECTION = 'deleteSection';
  DELETE_SHEET = 'deleteSheet';
  MOVE_TO_OTHER_SECTION = 'moveSheetToOtherSection';
  ADD_SECTION = 'addSection';
  EDIT_SECTION_NAME = 'editSectionName';
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
