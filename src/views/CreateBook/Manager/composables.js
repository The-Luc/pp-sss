import { useGetters, useMutations, useActions } from 'vuex-composition-helpers';

import userService from '@/api/user';

import {
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES,
  ACTIONS as BOOK_ACTIONS
} from '@/store/modules/book/const';

import { useAppCommon } from '@/hooks';

export const useManager = () => {
  const { setGeneralInfo } = useAppCommon();

  const { getBookData } = useActions({
    getBookData: BOOK_ACTIONS.GET_BOOK
  });

  const getBook = async ({ bookId }) => {
    const { title, totalSheet, totalPage, totalScreen } = await getBookData({
      bookId
    });

    setGeneralInfo({
      info: { title, bookId, totalSheet, totalPage, totalScreen }
    });
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

  const { updateAssignee } = useActions({
    updateAssignee: BOOK_ACTIONS.UPDATE_ASSIGNEE
  });

  return { updateSection, updateAssignee };
};

export const useAssigneeMenu = () => {
  const getUsers = userService.getUsers;

  return { getUsers };
};

export const useDueDateMenu = () => {
  const { specialDates } = useGetters({
    specialDates: BOOK_GETTERS.BOOK_DATES
  });

  return { specialDates };
};

export const useSectionControl = () => {
  const { currentUser } = useAppCommon();

  const { totalSection } = useGetters({
    totalSection: BOOK_GETTERS.TOTAL_SECTION
  });

  const { addSection } = useMutations({
    addSection: BOOK_MUTATES.ADD_SECTION
  });

  return { currentUser, totalSection, addSection };
};

export const useSectionItems = () => {
  const { currentUser } = useAppCommon();

  const { sections } = useGetters({
    sections: BOOK_GETTERS.SECTIONS
  });

  const { moveSection } = useMutations({
    moveSection: BOOK_MUTATES.MOVE_SECTION
  });

  return { currentUser, sections, moveSection };
};

export const useSectionName = () => {
  const { changeName } = useMutations({
    changeName: BOOK_MUTATES.EDIT_SECTION_NAME
  });

  return { changeName };
};
