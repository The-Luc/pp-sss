import { useGetters, useMutations, useActions } from 'vuex-composition-helpers';

import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';

import {
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES,
  ACTIONS as BOOK_ACTIONS
} from '@/store/modules/book/const';

export const useManager = () => {
  const { setInfo } = useMutations({
    setInfo: APP_MUTATES.SET_GENERAL_INFO
  });

  const { getBookData } = useActions({
    getBookData: BOOK_ACTIONS.GET_BOOK
  });

  const getBook = async ({ bookId }) => {
    const { title, totalSheet, totalPage, totalScreen } = await getBookData({
      bookId
    });

    setInfo({ title, bookId, totalSheet, totalPage, totalScreen });
  };

  return {
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

export const useSectionActionMenu = () => {
  const { updateSection } = useMutations({
    updateSection: BOOK_MUTATES.UPDATE_SECTION
  });

  return { updateSection };
};
