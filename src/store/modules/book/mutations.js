import randomcolor from 'randomcolor';
import { uniqueId } from 'lodash';

export const mutations = {
  updateSection(state, payload) {
    for (let i = 0; i < state.book.sections.length; i++) {
      if (payload.sectionId == state.book.sections[i].id) {
        state.book.sections[i].sheets = payload.sheets;

        break;
      }
    }
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
