import { useMutations, useGetters } from 'vuex-composition-helpers';

import { useAppCommon } from '@/hooks';

import {
  loadClipArtsApi,
  loadClipArtCategoriesApi,
  searchClipArtApi
} from '@/api/clipArt';
import {
  getPhotosApi,
  getMediaApi,
  getAlbumsAndCategoriesApi,
  getAssetByIdApi
} from '@/api/media';
import { savePortraitSettingsApi, getPortraiSettingsApi } from '@/api/portrait';

import {
  MUTATES as APP_MUTATES,
  GETTERS as APP_GETTERS
} from '@/store/modules/app/const';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';
import { uploadBase64ImageApi } from '@/api/util';
import {
  generateCanvasThumbnail,
  isOk,
  updateAssetInProject
} from '@/common/utils';

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
  const { isDigitalEdition, generalInfo } = useAppCommon();
  const isDigital = isDigitalEdition.value;
  const bookId = Number(generalInfo.value.bookId);

  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { communityId, mediaObjectIds } = useGetters({
    communityId: GETTERS.COMMUNITY_ID,
    mediaObjectIds: GETTERS.GET_MEDIA_OBJECT_IDS
  });

  const getAssetById = async assetId => {
    const asset = getAssetByIdApi(assetId, bookId);

    return updateAssetInProject(asset, mediaObjectIds.value);
  };

  const getAssetByKeywords = async (keywords, isGetMedia) => {
    const assets = isGetMedia
      ? await getMediaApi(communityId.value, keywords, bookId)
      : await getPhotosApi(communityId.value, keywords, bookId);

    return updateAssetInProject(assets, mediaObjectIds.value);
  };

  const getSmartbox = async (keywords, isGetMedia) => {
    return getAssetByKeywords(keywords, isGetMedia);
  };

  const getSearch = async (input, isGetMedia) => {
    return getAssetByKeywords([input], isGetMedia);
  };

  const getAlbums = async isGetVideo => {
    const data = await getAlbumsAndCategoriesApi(
      communityId.value,
      bookId,
      isGetVideo
    );
    const albums = data.albums;

    Object.values(albums).forEach(al => {
      al.forEach(a => {
        updateAssetInProject(a.assets, mediaObjectIds.value);
      });
    });
    return data;
  };

  return {
    getSmartbox,
    getSearch,
    getAlbums,
    getAssetById
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

export const useThumbnail = () => {
  const generateThumbnail = async (objects, isDigital) => {
    // generate frame thumbnails
    const base64Image = await generateCanvasThumbnail(objects, isDigital);

    // upload base64 images and get back url
    const res = await uploadBase64ImageApi(base64Image);

    return isOk(res) ? res.data : '';
  };

  const generateMultiThumbnails = async (objectsArr, isDigital) => {
    // generate frame thumbnails
    const base64Images = await Promise.all(
      objectsArr.map(objects => generateCanvasThumbnail(objects, isDigital))
    );

    // upload base64 images and get back url
    const res = await Promise.all(
      base64Images.map(img => uploadBase64ImageApi(img))
    );
    return res.map(response => (isOk(response) ? response.data : ''));
  };

  const uploadBase64Image = async (base64, isAutoSave) => {
    const res = await uploadBase64ImageApi(base64, isAutoSave);
    return isOk(res) ? res.data : '';
  };
  return {
    uploadBase64Image,
    generateCanvasThumbnail,
    generateThumbnail,
    generateMultiThumbnails
  };
};
