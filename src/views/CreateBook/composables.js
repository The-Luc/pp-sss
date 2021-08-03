import { useMutations, useGetters } from 'vuex-composition-helpers';

import {
  MUTATES as APP_MUTATES,
  GETTERS as APP_GETTERS
} from '@/store/modules/app/const';

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
