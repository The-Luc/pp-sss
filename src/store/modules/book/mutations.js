import APP from './const';

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

    const selectedSectionIndex = sections.findIndex(
      s => s.id === selectedSectionId
    );

    const sheet = sections[selectedSectionIndex].sheets[selectedIndex];

    const moveToSectionIndex = sections.findIndex(
      s => s.id === moveToSectionId
    );

    if (moveToSectionId !== selectedSectionId) {
      sections[selectedSectionIndex].sheets.splice(selectedIndex, 1);

      sections[moveToSectionIndex].sheets.splice(moveToIndex, 0, sheet);

      return;
    }

    const _items = Object.assign([], sections[moveToSectionIndex].sheets);

    if (moveToIndex < selectedIndex) {
      _items.splice(selectedIndex, 1);
      _items.splice(moveToIndex, 0, sheet);
    } else if (moveToIndex > selectedIndex) {
      _items.splice(moveToIndex + 1, 0, sheet);
      _items.splice(selectedIndex, 1);
    }

    sections[selectedSectionIndex].sheets = _items;
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
    const indexSection = sections.findIndex(item => item.id == sectionId);
    const indexCurrentSection = sections.findIndex(
      item => item.id == currentSectionId
    );
    const indexSheet = sections[indexSection].sheets.findIndex(
      item => item.id == sheetId
    );
    const sheet = { ...sections[indexSection].sheets[indexSheet] };
    sections[indexSection].sheets = [
      ...sections[indexSection].sheets.slice(0, indexSheet),
      ...sections[indexSection].sheets.slice(indexSheet + 1)
    ];

    if (indexCurrentSection !== sections.length - 1) {
      state.book.sections[indexCurrentSection].sheets = [
        ...sections[indexCurrentSection].sheets,
        sheet
      ];
    } else {
      state.book.sections[indexCurrentSection].sheets = [
        ...sections[indexCurrentSection].sheets.slice(
          0,
          sections[indexCurrentSection].sheets.length - 1
        ),
        sheet,
        ...sections[indexCurrentSection].sheets.slice(
          sections[indexCurrentSection].sheets.length - 1
        )
      ];
    }
  }
};
