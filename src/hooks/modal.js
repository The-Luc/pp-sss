import { useMutations, useGetters } from 'vuex-composition-helpers';

import {
  MUTATES as APP_MUTATES,
  GETTERS as APP_GETTERS
} from '@/store/modules/app/const';

/**
 * The hook trigger action to get and mutate state of modal from store
 */
export const useModal = () => {
  const { isOpenModal, modalData } = useGetters({
    isOpenModal: APP_GETTERS.IS_OPEN_MODAL,
    modalData: APP_GETTERS.MODAL_DATA
  });

  const { toggleModal } = useMutations({
    toggleModal: APP_MUTATES.TOGGLE_MODAL
  });

  return {
    isOpenModal,
    modalData,
    toggleModal
  };
};
