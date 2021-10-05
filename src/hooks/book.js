import { useActions, useGetters, useMutations } from 'vuex-composition-helpers';

import {
  ACTIONS as BOOK_ACTIONS,
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES
} from '@/store/modules/book/const';
import { MUTATES as PRINT_MUTATES } from '@/store/modules/print/const';
import { MUTATES as DIGITAL_MUTATES } from '@/store/modules/digital/const';

import bookService from '@/api/book';

/**
 * The hook trigger action to get book and get book information from store
 * @return {Object} Sheet;s id selected
 */
export const useBook = () => {
  const { getBook } = useActions({
    getBook: BOOK_ACTIONS.GET_BOOK
  });

  const { book, totalInfo, sections, maxPage } = useGetters({
    book: BOOK_GETTERS.BOOK_DETAIL,
    totalInfo: BOOK_GETTERS.TOTAL_INFO,
    sections: BOOK_GETTERS.SECTIONS_NO_SHEET,
    maxPage: BOOK_GETTERS.GET_MAX_PAGE
  });

  const { setBookId, addSheet } = useMutations({
    setBookId: BOOK_MUTATES.SET_BOOK_ID,
    addSheet: BOOK_MUTATES.ADD_SHEET
  });

  return {
    book,
    getBook,
    setBookId,
    totalInfo,
    sections,
    addSheet,
    maxPage
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

export const useMutationBook = (isDigital = false) => {
  const MUTATES = isDigital ? DIGITAL_MUTATES : PRINT_MUTATES;

  const { setBookInfo, setSectionsSheets } = useMutations({
    setBookInfo: MUTATES.SET_BOOK_INFO,
    setSectionsSheets: MUTATES.SET_SECTIONS_SHEETS
  });

  return { setBookInfo, setSectionsSheets };
};

export const useActionBook = (isDigital = false) => {
  const getBookInfo = isDigital
    ? bookService.getBookDigitalInfo
    : bookService.getBookPrintInfo;

  return { getBookInfo };
};
