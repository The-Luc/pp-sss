import { useGetters, useMutations } from 'vuex-composition-helpers';

import { getUsersApi } from '@/api/user';
import {
  addNewSectionApi,
  updateSectionApi,
  updateSectionOrderApi
} from '@/api/section';

import { useActionBook, useAppCommon } from '@/hooks';

import { SectionBase } from '@/common/models';

import { isEmpty, isOk, getUniqueColor, moveItem } from '@/common/utils';

import {
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES
} from '@/store/modules/book/const';
import { MUTATES as PRINT_MUTATES } from '@/store/modules/print/const';
import { MUTATES as DIGITAL_MUTATES } from '@/store/modules/digital/const';

import {
  GETTERS as APP_GETTERS,
  MUTATES as APP_MUTATES
} from '@/store/modules/app/const';

import { EDITION, BASE_SECTION_COLOR } from '@/common/constants';

const getSections = sections => {
  const sectionIds = [];
  const sectionObject = {};

  sections.forEach(section => {
    const { id } = section;

    sectionObject[id] = section;

    sectionIds.push(id);
  });

  return { sectionIds, sectionObject };
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
    const { book, sections, sheets } = await getBookInfo(bookId);

    setBook({ book });

    const { sectionIds, sectionObject } = getSections(sections);

    setSections({ sections: sectionObject, sectionIds });
    setSheets({ sheets });

    const { title, totalPages, totalSheets, totalScreens, communityId } = book;

    setGeneralInfo({
      info: {
        bookId,
        title,
        totalPages,
        totalSheets,
        totalScreens,
        communityId
      }
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
  const {
    updateManagerSection,
    updatePrintSection,
    updateDigitalSection,
    setSectionSelected
  } = useMutations({
    updateManagerSection: BOOK_MUTATES.UPDATE_SECTION,
    updatePrintSection: PRINT_MUTATES.UPDATE_SECTION,
    updateDigitalSection: DIGITAL_MUTATES.UPDATE_SECTION,
    setSectionSelected: APP_MUTATES.SET_SELECTION_SELECTED
  });

  const updateSection = async (data, activeEdition) => {
    // update to database
    const res = await updateSectionApi(data.id, data);

    if (res.assigneeId === null) res.assigneeId = -1;

    // update to store
    if (activeEdition === EDITION.PRINT) {
      return updatePrintSection(res);
    }
    if (activeEdition === EDITION.DIGITAL) {
      return updateDigitalSection(res);
    }

    updateManagerSection(res);
  };

  const { sectionSelected } = useGetters({
    sectionSelected: APP_GETTERS.SECTION_SELECTED
  });

  return { updateSection, setSectionSelected, sectionSelected };
};

export const useAssigneeMenu = () => {
  const { generalInfo } = useGetters({
    generalInfo: APP_GETTERS.GENERAL_INFO
  });

  const communityId = generalInfo.value.communityId;
  const getUsers = async () => await getUsersApi(communityId);

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
  const { importantDatesInfo } = useSummaryInfo();

  const { totalSection, colors, sectionIds } = useGetters({
    totalSection: BOOK_GETTERS.TOTAL_SECTION,
    colors: BOOK_GETTERS.COLORS,
    sectionIds: BOOK_GETTERS.SECTION_IDS
  });

  const { addSectionToStore } = useMutations({
    addSectionToStore: BOOK_MUTATES.ADD_SECTION
  });

  const addSection = async () => {
    const color = getUniqueColor(BASE_SECTION_COLOR, colors.value);

    const dueDate = isEmpty(importantDatesInfo?.value.releaseDate)
      ? null
      : importantDatesInfo.value.releaseDate;

    const data = {
      ...new SectionBase({ dueDate, color }),
      order: totalSection.value - 1 // above the last section
    };
    const lastSectionId = sectionIds.value[sectionIds.value.length - 1];
    const lastSectionParams = { order: totalSection.value };

    const res = await addNewSectionApi(
      generalInfo.value.bookId,
      data,
      lastSectionId,
      lastSectionParams
    );

    if (!isOk(res)) return;

    const { id } = res.data.create_book_section;

    addSectionToStore({ id, color, dueDate });

    return id;
  };

  return { currentUser, totalSection, addSection };
};

export const useSectionItems = () => {
  const { currentUser, generalInfo } = useAppCommon();

  const { sections, sectionIds } = useGetters({
    sections: BOOK_GETTERS.SECTIONS,
    sectionIds: BOOK_GETTERS.SECTION_IDS
  });

  const { moveSectionInStore } = useMutations({
    moveSectionInStore: BOOK_MUTATES.MOVE_SECTION
  });

  const moveSection = async (moveToIndex, selectedIndex) => {
    const sectionIdsNew = moveItem(
      sectionIds.value[selectedIndex],
      selectedIndex,
      moveToIndex,
      sectionIds.value
    );

    const isSuccess = await updateSectionOrderApi(
      generalInfo.value.bookId,
      sectionIdsNew
    );

    if (!isSuccess) return;

    moveSectionInStore({ sectionIds: sectionIdsNew });
  };

  return { currentUser, sections, moveSection };
};

export const useSectionName = () => {
  const { changeName } = useMutations({
    changeName: BOOK_MUTATES.EDIT_SECTION_NAME
  });

  return { changeName };
};
