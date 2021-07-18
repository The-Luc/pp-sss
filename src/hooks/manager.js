import { useGetters, useMutations, useActions } from 'vuex-composition-helpers';

import {
  GETTERS as BOOK_GETTERS,
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

export const useSummaryInfo = () => {
  const { importantDatesInfo, specificationInfo, saleInfo } = useGetters({
    importantDatesInfo: BOOK_GETTERS.IMPORTANT_DATES_INFO,
    specificationInfo: BOOK_GETTERS.SPECIFICATION_INFO,
    saleInfo: BOOK_GETTERS.SALE_INFO
  });

  return {
    importantDatesInfo,
    specificationInfo,
    saleInfo
  };
};
