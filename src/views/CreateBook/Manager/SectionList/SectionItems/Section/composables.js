import { useGetters, useMutations } from 'vuex-composition-helpers';

import {
  deleteSheetApi,
  updateSheetApi,
  updateSheetOrderApi
} from '@/api/sheet';
import { deleteSectionApi } from '@/api/section';

import { useAppCommon } from '@/hooks';

import { isOk, moveItem } from '@/common/utils';

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
    const isSuccess = await deleteSheetApi(sheetId);

    if (!isSuccess) return;

    removeSheetInStore({ sheetId, sectionId });

    toggleModal({ isOpenModal: false });
  };

  const deleteSection = async sectionId => {
    const res = await deleteSectionApi(sectionId);

    if (!isOk(res)) return;

    removeSectionInStore({ sectionId });

    toggleModal({ isOpenModal: false });
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
    moveToSectionId,
    selectedSectionId,
    moveToIndex,
    selectedIndex
  ) => {
    const affectCurrentData = sectionSheetIds.value[selectedSectionId]
      .map((sheetId, index) => ({ id: sheetId, order: index + 1 }))
      .filter((_, index) => {
        return index > selectedIndex;
      });

    const affectTargetData = sectionSheetIds.value[moveToSectionId]
      .map((sheetId, index) => ({ id: sheetId, order: index + 1 }))
      .filter((_, index) => {
        return index >= moveToIndex;
      });

    const apiCallPromise = affectCurrentData.map(d => {
      return updateSheetApi(d.id, { order: d.order });
    });

    affectTargetData.forEeach(d => {
      apiCallPromise.push(updateSheetApi(d.id, { order: d.order }));
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
    if (moveToSectionId === selectedSectionId) {
      return moveSheetLocaly(selectedSectionId, moveToIndex, selectedIndex);
    }

    return moveSheetToOthers(
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
