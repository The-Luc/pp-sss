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
  getCommunityAlbumsApi,
  getUserAlbumsApi,
  getQrrentByIdApi,
  getAlbumByIdApi,
  getAssetByIdApi,
  getInProjectAssetsApi,
  getAlbumCategoryApi
} from '@/api/media';
import { savePresetColorPickerApi, getPresetsColorPickerApi } from '@/api/util';
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
  isEmpty,
  arrayDifference
} from '@/common/utils';
import { getWorkspaceApi } from '@/api/sheet';
import { MAX_COLOR_PICKER_PRESET } from '@/common/constants';

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

  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const {
    communityId,
    mediaObjectIds,
    currentSheet,
    currentFrameId
  } = useGetters({
    communityId: GETTERS.COMMUNITY_ID,
    mediaObjectIds: GETTERS.GET_MEDIA_OBJECT_IDS,
    currentSheet: GETTERS.CURRENT_SHEET,
    currentFrameId: DIGITAL_GETTERS.CURRENT_FRAME_ID
  });

  const getInProjectAssets = async (bookId, projectId, isAutosave) => {
    return await getInProjectAssetsApi(
      bookId,
      projectId,
      isDigital,
      isAutosave
    );
  };

  const getCurrentInProjectIds = async () => {
    const bookId = Number(generalInfo.value.bookId);
    const projectId = isDigital
      ? currentFrameId.value
      : currentSheet.value.pageIds;

    return getInProjectAssets(bookId, projectId);
  };

  const updateInProjectAssets = (assets, inProjectIds) => {
    const { apiBookAssetIds, apiPageAssetIds } = inProjectIds;

    const currentAssetIds = mediaObjectIds.value;
    const deletedAssetsId = arrayDifference(apiPageAssetIds, currentAssetIds);

    assets.forEach(asset => {
      if (apiBookAssetIds.filter(id => asset.id === id).length > 0)
        asset.inProject = true;

      // if asset isn't in apiBookAsset or
      // asset in delete array and not in apiBookAsset

      if (
        apiBookAssetIds.filter(id => asset.id === id).length === 0 ||
        (deletedAssetsId.includes(asset.id) &&
          apiBookAssetIds.filter(id => asset.id === id).length < 2)
      )
        asset.inProject = false;

      if (currentAssetIds.includes(asset.id)) asset.inProject = true;
    });
    return assets;
  };

  const getMedia = async () => {
    const bookId = Number(generalInfo.value.bookId);
    const assetIds = await getWorkspaceApi(currentSheet.value.id, isDigital);

    const promises = assetIds.map(id => getAssetByIdApi(id, bookId));

    const media = await Promise.all(promises);

    const inProjectIds = await getCurrentInProjectIds();
    return updateInProjectAssets(media, inProjectIds);
  };

  const getAssetById = async assetId => {
    const bookId = Number(generalInfo.value.bookId);
    const asset = await getAssetByIdApi(assetId, bookId);

    const inProjectIds = await getCurrentInProjectIds();

    updateInProjectAssets([asset], inProjectIds);
    return asset;
  };

  const getAssetByKeywords = async (keywords, isGetMedia) => {
    const bookId = Number(generalInfo.value.bookId);
    const assets = isGetMedia
      ? await getMediaApi(communityId.value, keywords, bookId)
      : await getPhotosApi(communityId.value, keywords, bookId);

    const inProjectIds = await getCurrentInProjectIds();
    return updateInProjectAssets(assets, inProjectIds);
  };

  const getSmartbox = async (keywords, isGetMedia) => {
    const assets = await getAssetByKeywords(keywords, isGetMedia);

    const inProjectIds = await getCurrentInProjectIds();
    return updateInProjectAssets(assets, inProjectIds);
  };

  const getSearch = async (input, isGetMedia) => {
    const assets = await getAssetByKeywords([input], isGetMedia);

    const inProjectIds = await getCurrentInProjectIds();
    return updateInProjectAssets(assets, inProjectIds);
  };

  const getAlbums = async (MEDIA_CATEGORIES, type) => {
    const bookId = Number(generalInfo.value.bookId);

    // fetch all albums of a category
    const fetchFn = {
      [MEDIA_CATEGORIES.COMMUNITIES.value]: getCommunityAlbumsApi,
      [MEDIA_CATEGORIES.PERSONAL_ALBUMS.value]: getUserAlbumsApi
    };

    const albums = await fetchFn[type](communityId.value, bookId, 1);

    const inProjectIds = await getCurrentInProjectIds();

    albums.forEach(a => {
      updateInProjectAssets(a.assets, inProjectIds);
    });
    return albums;
  };

  const getCommunityAlbums = async (page = 1) => {
    const bookId = Number(generalInfo.value.bookId);
    const res = await getCommunityAlbumsApi(communityId.value, bookId, page);
    const albums = { communities: res };

    const inProjectIds = await getCurrentInProjectIds();

    Object.values(albums).forEach(al => {
      al.forEach(a => {
        updateInProjectAssets(a.assets, inProjectIds);
      });
    });
    return albums;
  };

  const getAlbumById = async id => {
    const bookId = Number(generalInfo.value.bookId);
    const album = await getAlbumByIdApi(id, bookId);

    if (isEmpty(album)) return [];

    const inProjectIds = await getCurrentInProjectIds();

    updateInProjectAssets(album.assets, inProjectIds);
    return [album];
  };

  const getQrrentById = async id => {
    const bookId = Number(generalInfo.value.bookId);
    const album = await getQrrentByIdApi(id, bookId);

    if (isEmpty(album)) return [];

    const inProjectIds = await getCurrentInProjectIds();

    album.forEach(al => {
      updateInProjectAssets(al.assets, inProjectIds);
    });

    return album;
  };

  const getAlbumCategory = async () => {
    return getAlbumCategoryApi(communityId.value);
  };

  return {
    getSmartbox,
    getSearch,
    getAlbums,
    getAssetById,
    getMedia,
    getInProjectAssets,
    getAlbumCategory,
    getCommunityAlbums,
    getAlbumById,
    getQrrentById
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

// is used for color picker cycle
// let next = 0;

export const useColorPicker = () => {
  const updateColorPicker = async color => {
    const colors = await getPresets();

    savePresetColorPickerApi(
      [color.substring(0, 7), ...colors].slice(0, MAX_COLOR_PICKER_PRESET)
    );
  };

  const getPresets = async () => await getPresetsColorPickerApi();

  return { updateColorPicker, getPresets };
};
