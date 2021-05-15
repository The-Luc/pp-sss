// import { ref, onMounted, watch } from '@vue/composition-api';

import bookService from '@/api/book';

export const useSheets = sectionId => {
  let sheets = [];

  function getSheets() {
    const response = bookService.getSheets(sectionId);

    sheets = response;
  }

  getSheets();

  return {
    sheets
  };
};
