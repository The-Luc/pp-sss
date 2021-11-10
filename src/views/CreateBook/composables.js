import { useMutations, useGetters } from 'vuex-composition-helpers';
import { getPhotos, getMedia, getAlbumsAndCategories } from '@/api/media';
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
      ? getMedia(book.communityId, keywords)
      : getPhotos(book.communityId, keywords);
  };

  const getSearch = async (input, isGetMedia) => {
    const { book } = await getBookInfo(generalInfo.value.bookId, true);
    return isGetMedia
      ? getMedia(book.communityId, [input])
      : getPhotos(book.communityId, [input]);
  };

  const getAlbums = async isGetMedia => {
    const { book } = await getBookInfo(generalInfo.value.bookId, true);
    const mediaType = isGetMedia ? 'videos' : 'images';

    return await getAlbumsAndCategories(book.communityId, mediaType);
  };

  return {
    getSmartbox,
    getSearch,
    getAlbums
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
      ? portraitSevice.getSavedPortraitSettingsDigital()
      : portraitSevice.getSavedPortraitSettingsPrint();
  };

  return {
    saveSettings,
    getSavedSettings
  };
};

export const useClipArt = () => {
  const searchClipArt = async input => clipArtService.searchClipArtApi(input);

  const getClipArtList = async categoryId =>
    clipArtService.loadClipArts(categoryId);

  const loadClipArtCategories = async () =>
    clipArtService.loadClipArtCategories();

  return {
    searchClipArt,
    getClipArtList,
    loadClipArtCategories
  };
};
