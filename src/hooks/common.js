import { useGetters, useMutations } from 'vuex-composition-helpers';

import { useUser } from './user';

import {
  GETTERS as APP_GETTERS,
  MUTATES as APP_MUTATES
} from '@/store/modules/app/const';

/**
 * use common app store's getters and mutates
 * @returns {Object} mapped values from app store
 */
export const useAppCommon = () => {
  const {
    activeEdition,
    isPrintEdition,
    isDigitalEdition,
    generalInfo,
    isLoading,
    notification
  } = useGetters({
    activeEdition: APP_GETTERS.ACTIVE_EDITION,
    isPrintEdition: APP_GETTERS.IS_PRINT_ACTIVE,
    isDigitalEdition: APP_GETTERS.IS_DIGITAL_ACTIVE,
    generalInfo: APP_GETTERS.GENERAL_INFO,
    isLoading: APP_GETTERS.IS_LOADING,
    notification: APP_GETTERS.NOTIFICATION
  });

  const {
    setEdition,
    setGeneralInfo,
    toggleModal,
    setLoadingState,
    setNotificationState
  } = useMutations({
    setEdition: APP_MUTATES.SET_ACTIVE_EDITION,
    setGeneralInfo: APP_MUTATES.SET_GENERAL_INFO,
    toggleModal: APP_MUTATES.TOGGLE_MODAL,
    setLoadingState: APP_MUTATES.SET_LOADING_STATE,
    setNotification: APP_MUTATES.SET_NOTIFICATION
  });

  const setActiveEdition = edition => setEdition({ edition });

  return {
    ...useUser(),
    activeEdition,
    isPrintEdition,
    isDigitalEdition,
    setActiveEdition,
    setGeneralInfo,
    generalInfo,
    isLoading,
    notification,
    toggleModal,
    setLoadingState,
    setNotificationState
  };
};
