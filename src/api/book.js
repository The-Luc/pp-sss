import api from '@/api/axios';
import { ENDPOINT } from '@/common/constants';

import book from '@/mock/book';

const bookService = {
  getBook: () => api.get(ENDPOINT.GET_BOOK),
  getSections: function(bookId) {
    return book.sections;
  },
  getSection: function(sectionId) {
    const index = book.sections.findIndex(s => s.id === sectionId);

    return index < 0 ? null : book.sections[index];
  },
  getSheets: function(sectionId) {
    const section = this.getSection(sectionId);

    return section === null ? [] : section.sheets;
  },
  getSheet: function(sectionId, sheetId) {
    const sheets = this.getSheets(sectionId);

    const index = sheets.findIndex(s => s.id === sheetId);

    return index < 0 ? null : sheets[index];
  },
  updateBook: data => {
    // api.put(`${ENDPOINT.GET_BOOK}/${data.albumId}`, data);
    return {
      status: 200,
      data: 'ok'
    };
  }
};

export default bookService;
