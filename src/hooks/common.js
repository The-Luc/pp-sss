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
    generalInfo
  } = useGetters({
    activeEdition: APP_GETTERS.ACTIVE_EDITION,
    isPrintEdition: APP_GETTERS.IS_PRINT_ACTIVE,
    isDigitalEdition: APP_GETTERS.IS_DIGITAL_ACTIVE,
    generalInfo: APP_GETTERS.GENERAL_INFO
  });

  const { setEdition, setGeneralInfo } = useMutations({
    setEdition: APP_MUTATES.SET_ACTIVE_EDITION,
    setGeneralInfo: APP_MUTATES.SET_GENERAL_INFO
  });

  const setActiveEdition = edition => setEdition({ edition });

  return {
    ...useUser(),
    activeEdition,
    isPrintEdition,
    isDigitalEdition,
    setActiveEdition,
    setGeneralInfo,
    generalInfo
  };
};
