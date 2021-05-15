// import { ref, onMounted, watch } from '@vue/composition-api';

import bookService from '@/api/book';

export const useSections = () => {
  let sections = [];

  function getSections() {
    const response = bookService.getSections();

    sections = response;
  }

  getSections();

  return {
    sections
  };
};
