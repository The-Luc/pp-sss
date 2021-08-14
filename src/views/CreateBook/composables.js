import { useMutations, useGetters, useActions } from 'vuex-composition-helpers';

import {
  MUTATES as APP_MUTATES,
  GETTERS as APP_GETTERS,
  ACTIONS as APP_ACTIONS
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

export const usePhotos = () => {
  const { isPhotoVisited } = useGetters({
    isPhotoVisited: APP_GETTERS.IS_PHOTO_VISITED
  });

  const { updatePhotoVisited } = useActions({
    updatePhotoVisited: APP_ACTIONS.UPDATE_PHOTO_VISITED
  });
  return {
    isPhotoVisited,
    updatePhotoVisited
  };
};
