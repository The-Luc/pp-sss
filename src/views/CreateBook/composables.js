import { useMutations, useGetters } from 'vuex-composition-helpers';

import { useAppCommon } from '@/hooks';

import {
  loadClipArtsApi,
  loadClipArtCategoriesApi,
  searchClipArtApi
} from '@/api/clipArt';
import { getPhotos, getMedia, getAlbumsAndCategories } from '@/api/media';
import { savePortraitSettingsApi, getPortraiSettingsApi } from '@/api/portrait';

import {
  MUTATES as APP_MUTATES,
  GETTERS as APP_GETTERS
} from '@/store/modules/app/const';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';

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
  const { value: isDigital } = useAppCommon().isDigitalEdition;

  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { communityId } = useGetters({
    communityId: GETTERS.COMMUNITY_ID
  });

  const getSmartbox = async (keywords, isGetMedia) => {
    return isGetMedia
      ? getMedia(communityId.value, keywords)
      : getPhotos(communityId.value, keywords);
  };

  const getSearch = async (input, isGetMedia) => {
    return isGetMedia
      ? getMedia(communityId.value, [input])
      : getPhotos(communityId.value, [input]);
  };

  const getAlbums = async isGetMedia => {
    const mediaType = isGetMedia ? 'videos' : 'images';

    return await getAlbumsAndCategories(communityId.value, mediaType);
  };

  return {
    getSmartbox,
    getSearch,
    getAlbums
  };
};

export const usePortraitFlow = () => {
  const { activeEdition, generalInfo, isDigitalEdition } = useAppCommon();

  const saveSettings = async flowSettings => {
    const settings = {
      ...flowSettings,
      layout_type: activeEdition.value.toUpperCase()
    };

    return savePortraitSettingsApi(generalInfo.value.bookId, settings);
  };

  const getSavedSettings = async () => {
    return getPortraiSettingsApi(
      generalInfo.value.bookId,
      isDigitalEdition.value
    );
  };

  return {
    saveSettings,
    getSavedSettings
  };
};

export const useClipArt = () => {
  return {
    searchClipArt: searchClipArtApi,
    getClipArtList: loadClipArtsApi,
    loadClipArtCategories: loadClipArtCategoriesApi
  };
};
