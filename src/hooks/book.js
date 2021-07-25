import { useActions, useGetters } from 'vuex-composition-helpers';

import { ACTIONS, GETTERS } from '@/store/modules/book/const';
import { ACTIONS as PRINT_ACTIONS } from '@/store/modules/print/const';
import bookService from '@/api/book';

/**
 * The hook trigger action to get book and get book information from store
 * @return {Object} Sheet;s id selected
 */
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

/**
 * The hook allow update book title
 * @return {Object} Function to update book title
 */
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

export const useSaveDefaultThemeId = () => {
  const { saveDefaultThemeId } = useActions({
    saveDefaultThemeId: PRINT_ACTIONS.SAVE_DEFAULT_THEME_ID
  });

  return { saveDefaultThemeId };
};

export const useSavePageInfo = () => {
  const { setPageInfo } = useActions({
    setPageInfo: PRINT_ACTIONS.SAVE_PAGE_INFO
  });

  return { setPageInfo };
};
