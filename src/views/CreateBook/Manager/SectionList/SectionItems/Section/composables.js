import { useGetters, useMutations } from 'vuex-composition-helpers';

import {
  deleteSheet as deleteSheetInDb,
  updateSheet as updateSheetDb
} from '@/api/sheet';
import { deleteSection as deleteSectionInDb } from '@/api/section';

import { useAppCommon } from '@/hooks';

import { isOk } from '@/common/utils';

import {
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES
} from '@/store/modules/book/const';

export const useActionSection = () => {
  const { toggleModal } = useAppCommon();

  const { sectionSheetIds, sectionIds } = useGetters({
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

  const deleteSheet = async (sheetId, sectionId) => {
    const res = await deleteSheetInDb(sheetId);

    if (!isOk(res)) return;

    removeSheetInStore({ sheetId, sectionId });

    toggleModal({ isOpenModal: false });
  };

  const deleteSection = async sectionId => {
    const res = await deleteSectionInDb(sectionId);

    if (!isOk(res)) return;

    removeSectionInStore({ sectionId });

    toggleModal({ isOpenModal: false });
  };

  const moveSheetLocaly = async (id, sectionId, moveToIndex, selectedIndex) => {
    const isMoveForward = moveToIndex > selectedIndex;
    const affectRange = Math.abs(moveToIndex - selectedIndex);
    const startIndex = isMoveForward ? selectedIndex + 1 : moveToIndex;

    const sheetIds = sectionSheetIds.value[sectionId].sheetIds;

    const affectSheetData = Array.from({ length: affectRange }, (_, index) => {
      return {
        id: sheetIds[index + startIndex],
        order: index + startIndex + (isMoveForward ? -1 : 1)
      };
    });

    const apiCallPromise = affectSheetData.map(d => {
      return updateSheetDb(d.id, { order: d.order });
    });

    apiCallPromise.push(updateSheetDb(id, { order: moveToIndex }));

    await Promise.all(apiCallPromise);

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
    const affectCurrentData = sectionSheetIds.value[selectedSectionId].sheetIds
      .map((sheetId, index) => ({ id: sheetId, order: index + 1 }))
      .filter((_, index) => {
        return index > selectedIndex;
      });

    const affectTargetData = sectionSheetIds.value[moveToSectionId].sheetIds
      .map((sheetId, index) => ({ id: sheetId, order: index + 1 }))
      .filter((_, index) => {
        return index >= moveToIndex;
      });

    const apiCallPromise = affectCurrentData.map(d => {
      return updateSheetDb(d.id, { order: d.order });
    });

    affectTargetData.forEeach(d => {
      apiCallPromise.push(updateSheetDb(d.id, { order: d.order }));
    });

    await Promise.all(apiCallPromise);

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
    console.log(
      id,
      moveToSectionId,
      selectedSectionId,
      moveToIndex,
      selectedIndex
    );
    if (moveToSectionId === selectedSectionId) {
      return moveSheetLocaly(id, selectedSectionId, moveToIndex, selectedIndex);
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
    const selectedIndex = sectionSheetIds.value[
      selectedSectionId
    ].sheetIds.findIndex(sheetId => id === sheetId);

    const targetSectionIndex = sectionIds.value.findIndex(
      sectionId => sectionId === moveToSectionId
    );

    const moveToIndex =
      sectionSheetIds.value[moveToSectionId].sheetIds.length -
      (targetSectionIndex === sectionIds.value.length - 1 ? 1 : 0);

    return moveSheet(
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
