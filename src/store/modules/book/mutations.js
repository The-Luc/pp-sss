export const mutations = {
  updateSection(state, payload) {
    for (let i = 0; i < state.book.sections.length; i++) {
      if (payload.sectionId == state.book.sections[i].id) {
        state.book.sections[i].sheets = payload.sheets;

        break;
      }
    }
  },
  deleteSheet(state, payload) {
    const { idSheet, idSection } = payload;
    const sectionIndex = state.book.sections.findIndex(item => {
      return item.id === idSection;
    });
    state.book.sections[sectionIndex].sheets = state.book.sections[
      sectionIndex
    ].sheets.filter(item => item.id !== idSheet);
    state.book.totalPages = state.book.totalPages - 2;
    state.book.totalSheets = state.book.totalSheets - 1;
    state.book.totalScreens = state.book.totalScreens - 1;
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
