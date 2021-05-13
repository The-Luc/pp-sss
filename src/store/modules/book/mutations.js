import { totalPages } from '@/mock/book';

export const mutations = {
  updateSection(state, payload) {
    for (let i = 0; i < state.book.sections.length; i++) {
      if (payload.sectionId == state.book.sections[i].id) {
        state.book.sections[i].sheets = payload.sheets;

        break;
      }
    }
  },
  addSheet(state, payload) {
    const { sectionId } = payload;
    const { totalPages, totalSheets, totalScreens, sections } = state.book;

    let index = sections.findIndex(item => item.id === sectionId);
    if (index !== sections.length - 1) {
      sections[index].sheets = [
        ...sections[index].sheets,
        {
          id: 34,
          type: 'full',
          fixed: true
        }
      ];
    } else {
      sections[index].sheets = [
        ...sections[index].sheets.slice(0, sections[index].sheets.length - 1),
        {
          id: 99,
          type: 'full',
          fixed: true
        },
        ...sections[index].sheets.slice(sections[index].sheets.length - 1)
      ];
    }
    state.book.totalPages = totalPages + 2;
    state.book.totalSheets = totalSheets + 1;
    state.book.totalScreens = totalScreens + 1;
  }
};
