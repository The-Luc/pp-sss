import { useActions, useGetters } from 'vuex-composition-helpers';

import { ACTIONS, GETTERS } from '@/store/modules/book/const';
import bookService from '@/api/book';

export const useBook = () => {
  const { getBook } = useActions({
    getBook: ACTIONS.GET_BOOK
  });

  const { book } = useGetters({
    book: GETTERS.BOOK_DETAIL
  });
  return {
    book,
    getBook
  };
};

export const useUpdateTitle = () => {
  const updateTitle = async (bookId, title) => {
    const { data, isSuccess } = await bookService.updateTitle(bookId, title);
    return {
      data,
      isSuccess
    };
  };

  return {
    updateTitle
  };
};
