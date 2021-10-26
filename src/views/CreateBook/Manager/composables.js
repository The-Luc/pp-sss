import { useGetters, useMutations } from 'vuex-composition-helpers';
import { merge } from 'lodash';

import { addNewSection, assignSectionUser } from '@/api/section';

import { useActionBook, useAppCommon } from '@/hooks';

import { getUsersApi } from '@/api/user';

import { isEmpty } from '@/common/utils';

import {
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES
} from '@/store/modules/book/const';

import {
  GETTERS as APP_GETTERS,
  MUTATES as APP_MUTATES
} from '@/store/modules/app/const';
import { isOk } from '@/common/utils';

const getSectionSheet = sectionsSheets => {
  const sectionIds = [];
  const sections = {};
  const sheets = {};

  sectionsSheets.forEach(section => {
    const sectionId = section.sectionDetail.id;

    sections[sectionId] = section.sectionDetail;

    sectionIds.push(sectionId);

    merge(sheets, section.sheets);
  });

  return { sectionIds, sections, sheets };
};

export const useManager = () => {
  const { setGeneralInfo } = useAppCommon();

  const { getBookInfo } = useActionBook();

  const { setBook, setSections, setSheets } = useMutations({
    setBook: BOOK_MUTATES.SET_BOOK,
    setSections: BOOK_MUTATES.SET_SECTIONS,
    setSheets: BOOK_MUTATES.SET_SHEETS
  });

  const getBook = async ({ bookId }) => {
    const { book, sectionsSheets } = await getBookInfo(bookId);

    setBook({ book });

    const { sectionIds, sections, sheets } = getSectionSheet(sectionsSheets);

    setSections({ sections, sectionIds });
    setSheets({ sheets });

    const { communityId, title, totalPage, totalSheet, totalScreen } = book;

    setGeneralInfo({
      info: { bookId, communityId, title, totalPage, totalSheet, totalScreen }
    });
  };

  return { getBook };
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
  const { updateSection, setSectionSelected } = useMutations({
    updateSection: BOOK_MUTATES.UPDATE_SECTION,
    setSectionSelected: APP_MUTATES.SET_SELECTION_SELECTED
  });

  const updateAssignee = async (sectionId, assigneeId) => {
    // update to database
    const res = await assignSectionUser(sectionId, assigneeId);

    if (!isOk(res)) return;
    // update to store
    updateSection({ id: sectionId, assigneeId });
  };
  const { sectionSelected } = useGetters({
    sectionSelected: APP_GETTERS.SECTION_SELECTED
  });

  return { updateSection, updateAssignee, setSectionSelected, sectionSelected };
};

export const useAssigneeMenu = () => {
  const getUsers = getUsersApi;

  return { getUsers };
};

export const useDueDateMenu = () => {
  const { specialDates } = useGetters({
    specialDates: BOOK_GETTERS.BOOK_DATES
  });

  return { specialDates };
};

export const useSectionControl = () => {
  const { currentUser, generalInfo } = useAppCommon();

  const { totalSection } = useGetters({
    totalSection: BOOK_GETTERS.TOTAL_SECTION
  });

  const { addSectionToStore } = useMutations({
    addSectionToStore: BOOK_MUTATES.ADD_SECTION
  });

  const addSection = async () => {
    const section = await addNewSection(generalInfo.value.bookId);

    if (isEmpty(section)) return;

    const { id, color, dueDate } = section;

    addSectionToStore({ id, color, dueDate });
  };

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
