import { useGetters, useMutations } from 'vuex-composition-helpers';

import bookService from '@/api/bookService';

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
    bookUserId
  } = useGetters({
    book: BOOK_GETTERS.BOOK_DETAIL,
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

    const totalSheetsInSection = sections.value[sectionIndex].sheetIds.length;

    const order =
      sectionIndex === sections.value.length - 1
        ? totalSheetsInSection - 1
        : totalSheetsInSection;

    const res = await addNewSheetApi(sectionId, {
      ...new SheetDetail(),
      order,
      isVisited: false
    });

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
    setBookId,
    totalInfo,
    sections,
    addSheet,
    maxPage,
    isPhotoVisited,
    updatePhotoVisited
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
