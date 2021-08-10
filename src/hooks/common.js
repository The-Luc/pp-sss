import { useGetters, useMutations, useActions } from 'vuex-composition-helpers';
import {
  GETTERS as APP_GETTERS,
  MUTATES as APP_MUTATES,
  ACTIONS as APP_ACTIONS
} from '@/store/modules/app/const';

/**
 * use common app store's getters and mutates
 * @returns {Object} mapped values from app store
 */
export const useAppCommon = () => {
  const { activeEdition, isPrintEdition, isDigitalEdition } = useGetters({
    activeEdition: APP_GETTERS.ACTIVE_EDITION,
    isPrintEdition: APP_GETTERS.IS_PRINT_ACTIVE,
    isDigitalEdition: APP_GETTERS.IS_DIGITAL_ACTIVE
  });

  const { setEdition } = useMutations({
    setEdition: APP_MUTATES.SET_ACTIVE_EDITION
  });

  const { getAppDetail } = useActions({
    getAppDetail: APP_ACTIONS.GET_APP_DETAIL
  });

  const setActiveEdition = edition => setEdition({ edition });

  return {
    activeEdition,
    isPrintEdition,
    isDigitalEdition,
    setActiveEdition,
    getAppDetail
  };
};
