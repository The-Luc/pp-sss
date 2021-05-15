import APP from './const';
import randomcolor from 'randomcolor';
import { uniqueId } from 'lodash';
import BOOK from './const';

const getIndexById = (items, id) => {
  return items.findIndex(s => s.id === id);
};

const getIndexByItem = (items, item) => {
  return getIndexById(items, item.id);
};

const moveToOtherSection = (
  sheet,
  currentSectionIndex,
  moveToSectionIndex,
  moveToSheetIndex,
  sections
) => {
  const sheetIndex = getIndexByItem(
    sections[currentSectionIndex].sheets,
    sheet
  );

  sections[currentSectionIndex].sheets.splice(sheetIndex, 1);

  sections[moveToSectionIndex].sheets.splice(moveToSheetIndex, 0, sheet);
};

const moveToSection = (
  currentSectionId,
  currentSheetIndex,
  moveToSectionId,
  moveToSheetIndex,
  sections
) => {
  const currentSectionIndex = getIndexById(sections, currentSectionId);
  const moveToSectionIndex = getIndexById(sections, moveToSectionId);

  moveToOtherSection(
    sections[currentSectionIndex].sheets[currentSheetIndex],
    currentSectionIndex,
    moveToSectionIndex,
    moveToSheetIndex,
    sections
  );
};

const moveItem = (item, currentIndex, moveToIndex, items) => {
  const _items = Object.assign([], items);

  if (moveToIndex < currentIndex) {
    _items.splice(currentIndex, 1);
    _items.splice(moveToIndex, 0, item);
  } else if (moveToIndex > currentIndex) {
    _items.splice(moveToIndex + 1, 0, item);
    _items.splice(currentIndex, 1);
  }

  return _items;
};

export const mutations = {
  [APP._MUTATES.UPDATE_SECTIONS](state, payload) {
    const { sections } = payload;

    state.book.sections = sections;
  },
  [APP._MUTATES.UPDATE_SHEETS](state, payload) {
    const { sectionId, sheets } = payload;

    const index = state.book.sections.findIndex(s => s.id === sectionId);

    if (index >= 0) {
      state.book.sections[index].sheets = sheets;
    }
  },
  [APP._MUTATES.UPDATE_SHEET_POSITION](state, payload) {
    const {
      moveToSectionId,
      moveToIndex,
      selectedSectionId,
      selectedIndex
    } = payload;

    const { sections } = state.book;

    if (moveToSectionId !== selectedSectionId) {
      moveToSection(
        selectedSectionId,
        selectedIndex,
        moveToSectionId,
        moveToIndex,
        sections
      );

      return;
    }

    const selectedSectionIndex = getIndexById(sections, selectedSectionId);
    const moveToSectionIndex = getIndexById(sections, moveToSectionId);

    sections[selectedSectionIndex].sheets = moveItem(
      sections[selectedSectionIndex].sheets[selectedIndex],
      selectedIndex,
      moveToIndex,
      sections[moveToSectionIndex].sheets
    );
  },
  [APP._MUTATES.UPDATE_SECTION_POSITION](state, payload) {
    const { moveToIndex, selectedIndex } = payload;

    let { sections } = state.book;

    const selectedSection = sections[selectedIndex];

    state.book.sections = moveItem(
      selectedSection,
      selectedIndex,
      moveToIndex,
      sections
    );
  },
  deleteSection(state, payload) {
    const { sectionId } = payload;
    const { sections } = state.book;
    const index = sections.findIndex(item => item.id == sectionId);
    state.book.sections = sections.filter(item => item.id !== sectionId);
    state.book.totalPages -= sections[index].sheets.length * 2;
    state.book.totalSheets -= sections[index].sheets.length;
    state.book.totalScreens -= sections[index].sheets.length;
  },
  deleteSheet(state, payload) {
    const { idSheet, idSection } = payload;
    const { totalPages, totalSheets, totalScreens, sections } = state.book;
    const sectionIndex = sections.findIndex(item => {
      return item.id === idSection;
    });
    state.book.sections[sectionIndex].sheets = sections[
      sectionIndex
    ].sheets.filter(item => item.id !== idSheet);
    state.book.totalPages = totalPages - 2;
    state.book.totalSheets = totalSheets - 1;
    state.book.totalScreens = totalScreens - 1;
  },
  moveSheet(state, payload) {
    const { sheetId, sectionId, currentSectionId } = payload;

    const { sections } = state.book;

    const currentSectionIndex = getIndexById(sections, sectionId);
    const moveToSectionIndex = getIndexById(sections, currentSectionId);

    const currentSheetIndex = getIndexById(
      sections[currentSectionIndex].sheets,
      sheetId
    );

    const totalSheetInMoveToSection =
      sections[moveToSectionIndex].sheets.length;

    const moveToIndex =
      moveToSectionIndex === sections.length - 1
        ? totalSheetInMoveToSection - 1
        : totalSheetInMoveToSection;

    moveToOtherSection(
      sections[currentSectionIndex].sheets[currentSheetIndex],
      currentSectionIndex,
      moveToSectionIndex,
      moveToIndex,
      sections
    );
  },
  addSection(state) {
    const { sections } = state.book;
    const newSectionId = uniqueId('id-');
    state.book.sections = [
      ...sections.slice(0, sections.length - 1),
      {
        color: randomcolor(),
        fixed: false,
        id: newSectionId,
        name: '',
        sheets: []
      },
      ...sections.slice(sections.length - 1)
    ];
    setTimeout(() => {
      const collapse = document
        .querySelector('#btn-ec-all')
        .getAttribute('data-toggle');
      let el = document.querySelector(`#section-${newSectionId}`);
      if (collapse !== 'collapse') {
        el.click();
      }
      let input = el.querySelector('input');
      input.focus();
    }, 0);
  },
  editSectionName(state, payload) {
    const { sectionId } = payload;
    let { sectionName } = payload;
    sectionName = sectionName || 'Untitled';
    const { sections } = state.book;
    const indexSection = sections.findIndex(item => item.id == sectionId);
    state.book.sections[indexSection].name = sectionName;
  }
};
