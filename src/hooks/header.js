import { useGetters, useMutations } from 'vuex-composition-helpers';

import {
  GETTERS as APP_GETTERS,
  MUTATES as APP_MUTATES
} from '@/store/modules/app/const';

// TODO: refactoring later to make it common

export const useHeader = () => {
  const { generalInfo } = useGetters({
    generalInfo: APP_GETTERS.GENERAL_INFO
  });

  return { generalInfo };
};

export const useBookName = () => {
  const { currentUser, generalInfo } = useGetters({
    currentUser: APP_GETTERS.USER,
    generalInfo: APP_GETTERS.GENERAL_INFO
  });

  const { setInfo } = useMutations({
    setInfo: APP_MUTATES.SET_GENERAL_INFO
  });

  return { currentUser, generalInfo, setInfo };
};
