import { useGetters, useMutations } from 'vuex-composition-helpers';

import { getBookDetail, setPhotoIsVisitedApi } from '@/api/book';

import { useAppCommon } from './common';
import { SheetDetail } from '@/common/models';
import { addNewSheetApi } from '@/api/sheet';
import { isOk } from '@/common/utils';

import {
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES
} from '@/store/modules/book/const';
import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';
import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';

/**
 * The hook trigger action to get book and get book information from store
 * @return {Object} Sheet;s id selected
 */
export const useBook = () => {
  const { value: isDigital } = useAppCommon().isDigitalEdition;

  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const {
    book,
    totalInfo,
    sections,
    maxPage,
    isPhotoVisited,
    bookUserId,
    bookId
  } = useGetters({
    book: BOOK_GETTERS.BOOK_DETAIL,
    bookId: BOOK_GETTERS.BOOK_ID,
    totalInfo: BOOK_GETTERS.TOTAL_INFO,
    sections: BOOK_GETTERS.SECTIONS,
    maxPage: BOOK_GETTERS.GET_MAX_PAGE,
    isPhotoVisited: GETTERS.IS_PHOTO_VISITED,
    bookUserId: GETTERS.BOOK_USER_ID
  });

  const { setBookInfo } = useMutationBook();

  const { setBookId, addSheetToStore, setGeneralInfo } = useMutations({
    setBookId: BOOK_MUTATES.SET_BOOK_ID,
    addSheetToStore: BOOK_MUTATES.ADD_SHEET,
    setGeneralInfo: APP_MUTATES.SET_GENERAL_INFO
  });

  const addSheet = async sectionId => {
    const sectionIndex = sections.value.findIndex(
      section => section.id === sectionId
    );

    const isAddToLastSection = sectionIndex === sections.value.length - 1;
    const sheetIds = sections.value[sectionIndex].sheetIds;
    const lastSheetId = isAddToLastSection ? sheetIds[sheetIds.length - 1] : '';
    const totalSheetsInSection = sheetIds.length;

    const order = isAddToLastSection
      ? totalSheetsInSection - 1
      : totalSheetsInSection;

    const res = await addNewSheetApi(
      sectionId,
      {
        ...new SheetDetail(),
        order,
        isVisited: false
      },
      lastSheetId
    );

    if (!isOk(res)) return;

    addSheetToStore({
      sectionId,
      sheetId: res.data.create_sheet.id,
      order
    });

    const { totalSheets, totalPages, totalScreens } = book.value;

    setGeneralInfo({ info: { totalSheets, totalPages, totalScreens } });
  };

  const updatePhotoVisited = async () => {
    const isSuccess = await setPhotoIsVisitedApi(bookUserId.value, isDigital);

    if (!isSuccess) return;

    setBookInfo({ info: { isPhotoVisited: true } });
  };

  return {
    book,
    bookId,
    setBookId,
    totalInfo,
    sections,
    addSheet,
    maxPage,
    isPhotoVisited,
    updatePhotoVisited
  };
};

export const useMutationBook = () => {
  const { value: isDigital } = useAppCommon().isDigitalEdition;

  const MUTATES = isDigital ? DIGITAL_MUTATES : PRINT_MUTATES;

  const { setBookInfo, setSectionsSheets } = useMutations({
    setBookInfo: MUTATES.SET_BOOK_INFO,
    setSectionsSheets: MUTATES.SET_SECTIONS_SHEETS
  });

  return { setBookInfo, setSectionsSheets };
};

export const useActionBook = () => {
  const { value: activeEdition } = useAppCommon().activeEdition;

  const getBookInfo = async (bookId, isEditor = false) => {
    return getBookDetail(bookId, activeEdition, isEditor);
  };

  return { getBookInfo };
};
