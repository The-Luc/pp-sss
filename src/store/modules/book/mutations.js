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
  },
  moveSheet(state, payload) {
    const { sheetId, sectionId, currentSectionId } = payload;
    const indexSection = state.book.sections.findIndex(
      item => item.id == sectionId
    );
    const indexCurrentSection = state.book.sections.findIndex(
      item => item.id == currentSectionId
    );
    const indexSheet = state.book.sections[indexSection].sheets.findIndex(
      item => item.id == sheetId
    );
    const sheet = { ...state.book.sections[indexSection].sheets[indexSheet] };
    state.book.sections[indexSection].sheets = [
      ...state.book.sections[indexSection].sheets.slice(0, indexSheet),
      ...state.book.sections[indexSection].sheets.slice(indexSheet + 1)
    ];

    if (indexCurrentSection !== state.book.sections.length - 1) {
      console.log(1);
      state.book.sections[indexCurrentSection].sheets = [
        ...state.book.sections[indexCurrentSection].sheets,
        sheet
      ];
    } else {
      state.book.sections[indexCurrentSection].sheets = [
        ...state.book.sections[indexCurrentSection].sheets.slice(
          0,
          state.book.sections[indexCurrentSection].sheets.length - 1
        ),
        sheet,
        ...state.book.sections[indexCurrentSection].sheets.slice(
          state.book.sections[indexCurrentSection].sheets.length - 1
        )
      ];
    }
  }
};
