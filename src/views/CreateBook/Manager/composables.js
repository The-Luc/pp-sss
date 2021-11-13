import { useGetters, useMutations } from 'vuex-composition-helpers';

import { getUsersApi } from '@/api/user';
import { addNewSection } from '@/api/section';

import { useActionBook, useAppCommon } from '@/hooks';

import { SectionBase } from '@/common/models';

import { isEmpty, isOk, getUniqueColor } from '@/common/utils';

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
import { updateSection as updateSectionDB } from '@/api/section';
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

    const { title, totalPages, totalSheets, totalScreens } = book;

    setGeneralInfo({
      info: {
        bookId,
        title,
        totalPages,
        totalSheets,
        totalScreens
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
    const res = await updateSectionDB(data.id, data);

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
  const { importantDatesInfo } = useSummaryInfo();

  const { totalSection, colors } = useGetters({
    totalSection: BOOK_GETTERS.TOTAL_SECTION,
    colors: BOOK_GETTERS.COLORS
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
      order: totalSection.value - 2
    };

    const res = await addNewSection(generalInfo.value.bookId, data);

    if (!isOk(res)) return;

    const { id } = res.data.create_book_section;

    addSectionToStore({ id, color, dueDate });

    return id;
  };

  return { currentUser, totalSection, addSection };
};

export const useSectionItems = () => {
  const { currentUser } = useAppCommon();

  const { sections, sectionIds } = useGetters({
    sections: BOOK_GETTERS.SECTIONS,
    sectionIds: BOOK_GETTERS.SECTION_IDS
  });

  const { moveSectionInStore } = useMutations({
    moveSectionInStore: BOOK_MUTATES.MOVE_SECTION
  });

  const moveSection = async (id, moveToIndex, selectedIndex) => {
    const isMoveForward = moveToIndex > selectedIndex;
    const affectRange = Math.abs(moveToIndex - selectedIndex);
    const startIndex = isMoveForward ? selectedIndex + 1 : moveToIndex;

    const affectSectionData = Array.from(
      { length: affectRange },
      (_, index) => {
        return {
          id: sectionIds.value[index + startIndex],
          order: index + startIndex + (isMoveForward ? -1 : 1)
        };
      }
    );

    const apiCallPromise = affectSectionData.map(d => {
      return updateSectionDB(d.id, { order: d.order });
    });

    apiCallPromise.push(updateSectionDB(id, { order: moveToIndex }));

    await Promise.all(apiCallPromise);

    moveSectionInStore({ id, moveToIndex, selectedIndex });
  };

  return { currentUser, sections, moveSection };
};

export const useSectionName = () => {
  const { changeName } = useMutations({
    changeName: BOOK_MUTATES.EDIT_SECTION_NAME
  });

  return { changeName };
};
