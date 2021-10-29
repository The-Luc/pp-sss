import { useMutations } from 'vuex-composition-helpers';

import { deleteSheet as deleteSheetInDb } from '@/api/sheet';
import { deleteSection as deleteSectionInDb } from '@/api/section';

import { useAppCommon } from '@/hooks';

import { isOk } from '@/common/utils';

import { MUTATES as BOOK_MUTATES } from '@/store/modules/book/const';

export const useActionSection = () => {
  const { toggleModal } = useAppCommon();

  const { removeSheetInStore, removeSectionInStore } = useMutations({
    removeSheetInStore: BOOK_MUTATES.DELETE_SHEET,
    removeSectionInStore: BOOK_MUTATES.DELETE_SECTION
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

  return { toggleModal, deleteSheet, deleteSection };
};
