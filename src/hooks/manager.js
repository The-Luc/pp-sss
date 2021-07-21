import { useGetters, useMutations, useActions } from 'vuex-composition-helpers';

import userService from '@/api/user';

import {
  GETTERS as APP_GETTERS,
  MUTATES as APP_MUTATES
} from '@/store/modules/app/const';

import {
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES,
  ACTIONS as BOOK_ACTIONS
} from '@/store/modules/book/const';

// TODO: refactoring later to make it common

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

const useCurrentUser = () => {
  const { currentUser } = useGetters({
    currentUser: APP_GETTERS.USER
  });

  return { currentUser };
};

export const useSectionControl = () => {
  const { totalSection } = useGetters({
    totalSection: BOOK_GETTERS.TOTAL_SECTION
  });

  const { addSection } = useMutations({
    addSection: BOOK_MUTATES.ADD_SECTION
  });

  return { ...useCurrentUser(), totalSection, addSection };
};

export const useSectionItems = () => {
  const { sections } = useGetters({
    sections: BOOK_GETTERS.SECTIONS
  });

  const { moveSection } = useMutations({
    moveSection: BOOK_MUTATES.MOVE_SECTION
  });

  return { ...useCurrentUser(), sections, moveSection };
};

export const useSectionName = () => {
  const { changeName } = useMutations({
    changeName: BOOK_MUTATES.EDIT_SECTION_NAME
  });

  return { changeName };
};
