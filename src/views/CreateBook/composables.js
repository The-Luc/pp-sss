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

export const usePhotoSidebar = () => {
  const { isOpenPhotoSidebar } = useGetters({
    isOpenPhotoSidebar: APP_GETTERS.IS_OPEN_PHOTO_SIDEBAR
  });
  const { togglePhotos } = useMutations({
    togglePhotos: APP_MUTATES.TOGGLE_PHOTO_SIDEBAR
  });
  return {
    isOpenPhotoSidebar,
    togglePhotos
  };
};
