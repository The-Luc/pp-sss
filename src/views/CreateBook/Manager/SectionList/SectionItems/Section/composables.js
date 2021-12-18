import { useGetters, useMutations } from 'vuex-composition-helpers';

import { deleteSheetApi, moveSheetApi, updateSheetOrderApi } from '@/api/sheet';
import { deleteSectionApi } from '@/api/section';

import { useAppCommon } from '@/hooks';

import { moveItem } from '@/common/utils';

import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';

import {
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES
} from '@/store/modules/book/const';

export const useActionSection = () => {
  const { toggleModal } = useAppCommon();

  const { book, sectionSheetIds, sectionIds } = useGetters({
    book: BOOK_GETTERS.BOOK_DETAIL,
    sectionSheetIds: BOOK_GETTERS.SECTION_SHEET_IDS,
    sectionIds: BOOK_GETTERS.SECTION_IDS
  });

  const {
    removeSheetInStore,
    removeSectionInStore,
    moveSheetInStore
  } = useMutations({
    removeSheetInStore: BOOK_MUTATES.DELETE_SHEET,
    removeSectionInStore: BOOK_MUTATES.DELETE_SECTION,
    moveSheetInStore: BOOK_MUTATES.MOVE_SHEET
  });

  const { setGeneralInfo } = useMutations({
    setGeneralInfo: APP_MUTATES.SET_GENERAL_INFO
  });

  const updateTotalPage = () => {
    const { totalSheets, totalPages, totalScreens } = book.value;

    setGeneralInfo({ info: { totalSheets, totalPages, totalScreens } });
  };

  /**
   * To remove a sheet and reorder sheet order behind deleted sheet
   * @param {String} sheetId sheet id
   * @param {String} sectionId section Id
   */
  const deleteSheet = async (sheetId, sectionId) => {
    const sheetIds = sectionSheetIds.value[sectionId]
      .filter(id => id !== sheetId)
      .map(id => parseInt(id));

    const isSuccess = await deleteSheetApi(sheetId, sectionId, sheetIds);

    toggleModal({ isOpenModal: false });

    if (!isSuccess) return;

    removeSheetInStore({ sheetId, sectionId });

    updateTotalPage();
  };

  const deleteSection = async sectionId => {
    const bookId = book.value.id;
    const newSectionIds = sectionIds.value
      .filter(id => id !== sectionId)
      .map(id => Number(id));

    const isSuccess = await deleteSectionApi(sectionId, bookId, newSectionIds);

    toggleModal({ isOpenModal: false });

    if (!isSuccess) return;

    removeSectionInStore({ sectionId });

    updateTotalPage();
  };

  const moveSheetLocaly = async (sectionId, moveToIndex, selectedIndex) => {
    const currentSection = sectionSheetIds.value[sectionId];

    const sheetIds = moveItem(
      currentSection[selectedIndex],
      selectedIndex,
      moveToIndex,
      currentSection
    );

    const isSuccess = await updateSheetOrderApi(sectionId, sheetIds);

    if (!isSuccess) return;

    moveSheetInStore({
      moveToSectionId: sectionId,
      moveToIndex,
      selectedSectionId: sectionId,
      selectedIndex
    });
  };

  const moveSheetToOthers = async (
    id,
    moveToSectionId,
    selectedSectionId,
    moveToIndex,
    selectedIndex
  ) => {
    const isSuccess = await moveSheetApi(moveToSectionId, moveToIndex, id);

    if (!isSuccess) return;

    moveSheetInStore({
      moveToSectionId,
      moveToIndex,
      selectedSectionId,
      selectedIndex
    });
  };

  const moveSheet = async (
    id,
    moveToSectionId,
    selectedSectionId,
    moveToIndex,
    selectedIndex
  ) => {
    if (moveToSectionId === selectedSectionId) {
      return moveSheetLocaly(selectedSectionId, moveToIndex, selectedIndex);
    }

    return moveSheetToOthers(
      id,
      moveToSectionId,
      selectedSectionId,
      moveToIndex,
      selectedIndex
    );
  };

  const moveSheetToSpecificSection = async (
    id,
    moveToSectionId,
    selectedSectionId
  ) => {
    const targetSectionIndex = sectionIds.value.findIndex(
      sectionId => sectionId === moveToSectionId
    );

    const selectedIndex = sectionSheetIds.value[selectedSectionId].findIndex(
      sheetId => id === sheetId
    );

    const moveToIndex =
      sectionSheetIds.value[moveToSectionId].length -
      (targetSectionIndex === sectionIds.value.length - 1 ? 1 : 0);

    const isSuccess = await moveSheetApi(moveToSectionId, moveToIndex, id);

    if (!isSuccess) return;

    moveSheet(
      id,
      moveToSectionId,
      selectedSectionId,
      moveToIndex,
      selectedIndex
    );
  };

  return {
    toggleModal,
    deleteSheet,
    deleteSection,
    moveSheet,
    moveSheetToSpecificSection
  };
};
