import { useMutations, useGetters } from 'vuex-composition-helpers';
import { getPhotos, getMedia } from '@/api/media';
import { clipArtService } from '@/api/clipArt/api';
import portraitSevice from '@/api/portrait';
import { useActionBook, useAppCommon } from '@/hooks';

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

export const usePhotos = () => {
  const { getBookInfo } = useActionBook();
  const { generalInfo } = useAppCommon();

  const getSmartbox = async (keywords, isGetMedia) => {
    const { book } = await getBookInfo(generalInfo.value.bookId, true);
    return isGetMedia
      ? await getMedia(book.communityId, keywords)
      : await getPhotos(book.communityId, keywords);
  };

  const getSearch = async (input, isGetMedia) => {
    const { book } = await getBookInfo(generalInfo.value.bookId, true);
    return isGetMedia
      ? await getMedia(book.communityId, [input])
      : await getPhotos(book.communityId, [input]);
  };

  return {
    getSmartbox,
    getSearch
  };
};

export const usePortraitFlow = () => {
  const saveSettings = async (flowSettings, isDigital) => {
    isDigital
      ? await portraitSevice.savePortraitSettingsDigital(flowSettings)
      : await portraitSevice.savePortraitSettingsPrint(flowSettings);
  };

  const getSavedSettings = async isDigital => {
    return isDigital
      ? await portraitSevice.getSavedPortraitSettingsDigital()
      : await portraitSevice.getSavedPortraitSettingsPrint();
  };

  return {
    saveSettings,
    getSavedSettings
  };
};

export const useClipArt = () => {
  const searchClipArt = async input => {
    return await clipArtService.searchClipArtApi(input);
  };

  const getClipArtList = async categoryId => {
    return await clipArtService.loadClipArts(categoryId);
  };

  const loadClipArtCategories = async () => {
    return await clipArtService.loadClipArtCategories();
  };

  return {
    searchClipArt,
    getClipArtList,
    loadClipArtCategories
  };
};
