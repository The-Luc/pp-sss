import { useGetters, useMutations } from 'vuex-composition-helpers';
import {
  GETTERS as APP_GETTERS,
  MUTATES as APP_MUTATES
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

  const setActiveEdition = edition => setEdition({ edition });

  return {
    activeEdition,
    isPrintEdition,
    isDigitalEdition,
    setActiveEdition
  };
};
