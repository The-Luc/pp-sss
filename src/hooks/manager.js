import { useMutations, useActions } from 'vuex-composition-helpers';

import {
  MUTATES as BOOK_MUTATES,
  ACTIONS as BOOK_ACTIONS
} from '@/store/modules/book/const';

export const useManager = () => {
  const { setBookId } = useMutations({
    setBookId: BOOK_MUTATES.SET_BOOK_ID
  });

  const { getBook } = useActions({
    getBook: BOOK_ACTIONS.GET_BOOK
  });

  return {
    setBookId,
    getBook
  };
};
