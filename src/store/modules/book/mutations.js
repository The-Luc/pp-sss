import { uniqueId } from 'lodash';

import { setBookId, setBook, setSheets } from '@/common/store';

import { isEmpty, moveItem } from '@/common/utils';

import BOOK from './const';

import { SectionDetail, SheetDetail } from '@/common/models';

export const mutations = {
  [BOOK._MUTATES.SET_BOOK_ID]: setBookId,
  [BOOK._MUTATES.SET_BOOK]: setBook,
  [BOOK._MUTATES.SET_SECTIONS]: (state, { sections, sectionIds }) => {
    state.sections = sections;
    state.sectionIds = sectionIds;
  },
  [BOOK._MUTATES.SET_SHEETS]: setSheets,
  [BOOK._MUTATES.UPDATE_SECTION](state, { id, status, dueDate, assigneeId }) {
    if (!isEmpty(status)) state.sections[id].status = status;

    if (!isEmpty(dueDate)) state.sections[id].dueDate = dueDate;

    if (!isEmpty(assigneeId)) state.sections[id].assigneeId = assigneeId;
  },
  [BOOK._MUTATES.UPDATE_SHEETS](state, payload) {
    const { sectionId, sheets } = payload;

    const index = state.book.sections.findIndex(s => s.id === sectionId);

    if (index >= 0) {
      state.book.sections[index].sheets = sheets;
    }
  },
  [BOOK._MUTATES.MOVE_SHEET](
    state,
    { moveToSectionId, moveToIndex, selectedSectionId, selectedIndex }
  ) {
    const selectedSection = state.sections[selectedSectionId];

    if (moveToSectionId === selectedSectionId) {
      state.sections[selectedSectionId].sheetIds = moveItem(
        selectedSection.sheetIds[selectedIndex],
        selectedIndex,
        moveToIndex,
        selectedSection.sheetIds
      );

      return;
    }

    const sheetId = selectedSection.sheetIds[selectedIndex];

    state.sections[selectedSectionId].sheetIds.splice(selectedIndex, 1);

    state.sections[moveToSectionId].sheetIds.splice(moveToIndex, 0, sheetId);
  },
  [BOOK._MUTATES.MOVE_SECTION](state, { moveToIndex, selectedIndex }) {
    state.sectionIds = moveItem(
      state.sectionIds[selectedIndex],
      selectedIndex,
      moveToIndex,
      state.sectionIds
    );
  },
  [BOOK._MUTATES.ADD_SHEET](state, { sectionId }) {
    const newId = uniqueId(sectionId);

    const sectionIndex = state.sectionIds.findIndex(id => id === sectionId);

    const totalSheet = state.sections[sectionId].sheetIds.length;

    const newIndex =
      sectionIndex === state.sectionIds.length - 1
        ? totalSheet - 1
        : totalSheet;

    state.sheets = { ...state.sheets, [newId]: new SheetDetail({ id: newId }) };

    state.sections[sectionId].sheetIds.splice(newIndex, 0, newId);

    state.book.totalPages += 2;
    state.book.totalSheets += 1;
    state.book.totalScreens += 1;
  },
  [BOOK._MUTATES.DELETE_SECTION](state, { sectionId }) {
    state.sectionIds = state.sectionIds.filter(id => id !== sectionId);

    const totalSheet = state.sections[sectionId].sheetIds.length;

    delete state.sections[sectionId];

    state.book.totalPages -= totalSheet * 2;
    state.book.totalSheets -= totalSheet;
    state.book.totalScreens -= totalSheet;
  },
  [BOOK._MUTATES.DELETE_SHEET](state, { sheetId, sectionId }) {
    const { totalPages, totalSheets, totalScreens } = state.book;

    const sheetIds = state.sections[sectionId].sheetIds;

    state.sections[sectionId].sheetIds = sheetIds.filter(id => id !== sheetId);

    delete state.sheets[sheetId];

    state.book.totalPages = totalPages - 2;
    state.book.totalSheets = totalSheets - 1;
    state.book.totalScreens = totalScreens - 1;
  },
  [BOOK._MUTATES.MOVE_TO_OTHER_SECTION](
    state,
    { sheetId, sectionId, currentSectionId }
  ) {
    const sheetIds = state.sections[currentSectionId].sheetIds;

    state.sections[currentSectionId].sheetIds = sheetIds.filter(
      id => id !== sheetId
    );

    const moveToSectionIndex = state.sectionIds.findIndex(
      id => id === sectionId
    );

    const totalSheet = state.sections[sectionId].sheetIds.length;

    const moveToIndex =
      moveToSectionIndex === state.sectionIds.length - 1
        ? totalSheet - 1
        : totalSheet;

    state.sections[sectionId].sheetIds.splice(moveToIndex, 0, sheetId);
  },
  [BOOK._MUTATES.ADD_SECTION](state, { id, color, dueDate }) {
    state.sections = {
      ...state.sections,
      [id]: new SectionDetail({ id, color, dueDate })
    };

    state.sectionIds.splice(state.sectionIds.length - 1, 0, id);
  },
  [BOOK._MUTATES.EDIT_SECTION_NAME](state, { sectionId, sectionName }) {
    state.sections[sectionId].name = sectionName;
  },
  [BOOK._MUTATES.GET_BOOK_SUCCESS](state, payload) {
    state.book = payload;
  }
};
