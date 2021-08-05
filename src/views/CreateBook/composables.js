import { useMutations, useGetters } from 'vuex-composition-helpers';

import {
  MUTATES as APP_MUTATES,
  GETTERS as APP_GETTERS
} from '@/store/modules/app/const';

export const useSavingStatus = () => {
  const { savingStatus } = useGetters({
    savingStatus: APP_GETTERS.SAVING_STATUS
  });

  const { updateSavingStatus } = useMutations({
    updateSavingStatus: APP_MUTATES.UPDATE_SAVING_STATUS
  });

  return { savingStatus, updateSavingStatus };
};

export const usePhoto = () => {
  const { isPhotoVisited } = useGetters({
    isPhotoVisited: APP_GETTERS.IS_PHOTO_VISITED
  });
  const { setPhotoVisited } = useMutations({
    setPhotoVisited: APP_MUTATES.SET_PHOTO_VISITED
  });
  return {
    isPhotoVisited,
    setPhotoVisited
  };
};
