import { useMutations, useGetters } from 'vuex-composition-helpers';
import { uniqBy, sortBy, get, cloneDeep } from 'lodash';

import { useAppCommon, useTextStyle } from '@/hooks';

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
  getAlbumCategoryApi,
  uploadAssetsApi,
  getUserAvailableAlbumApi
} from '@/api/media';
import {
  savePresetColorPickerApi,
  getPresetsColorPickerApi,
  uploadBase64ImageApi,
  getUploadTokenApi
} from '@/api/util';
import { savePortraitSettingsApi, getPortraiSettingsApi } from '@/api/portrait';

import {
  MUTATES as APP_MUTATES,
  GETTERS as APP_GETTERS
} from '@/store/modules/app/const';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';
import {
  generateCanvasThumbnail,
  isOk,
  isEmpty,
  arrayDifference
} from '@/common/utils';
import { getWorkspaceApi, updateSheetApi } from '@/api/sheet';
import { MAX_COLOR_PICKER_PRESET } from '@/common/constants';
import { getFontsApi } from '@/api/text';
import { loadFonts } from '@/common/utils/text';
import { useImageStyle } from '@/hooks/style';
import {
  createAlbumAssetsApi,
  updateAlbumAssetsApi
} from '@/api/media/api_mutation';

export const useSavingStatus = () => {
  const { savingStatus } = useGetters({
    savingStatus: APP_GETTERS.SAVING_STATUS
  });

  const { updateSavingStatus } = useMutations({
    updateSavingStatus: APP_MUTATES.UPDATE_SAVING_STATUS
  });

  return { savingStatus, updateSavingStatus };
};

export const useAssets = () => {
  const { isDigitalEdition, generalInfo } = useAppCommon();
  const isDigital = isDigitalEdition.value;

  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { mediaObjectIds, currentSheet, currentFrameId } = useGetters({
    communityId: GETTERS.COMMUNITY_ID,
    mediaObjectIds: GETTERS.GET_MEDIA_OBJECT_IDS,
    currentSheet: GETTERS.CURRENT_SHEET,
    currentFrameId: DIGITAL_GETTERS.CURRENT_FRAME_ID
  });

  const getInProjectAssets = async (bookId, projectId) => {
    return getInProjectAssetsApi(bookId, projectId, isDigital);
  };

  const getCurrentInProjectIds = async () => {
    const bookId = Number(generalInfo.value.bookId);
    const projectId = isDigital
      ? currentFrameId.value
      : currentSheet.value.pageIds;

    return getInProjectAssets(bookId, projectId);
  };
  const mutateInProject = (
    asset,
    apiBookAssetIds,
    currentAssetIds,
    deletedAssetsId
  ) => {
    const isInBook = apiBookAssetIds.filter(id => asset.id === id).length > 0;
    if (isInBook) asset.inProject = true;

    // if asset isn't in apiBookAsset or
    // asset in delete array and not in apiBookAsset
    const isRemoved =
      deletedAssetsId.includes(asset.id) &&
      apiBookAssetIds.filter(id => asset.id === id).length < 2;

    if (!isInBook || isRemoved) asset.inProject = false;

    if (currentAssetIds.includes(asset.id)) asset.inProject = true;
  };

  const updateInProjectAssets = (assets, inProjectIds) => {
    if (!assets) return [];

    const { apiBookAssetIds, apiPageAssetIds } = inProjectIds;

    const currentAssetIds = mediaObjectIds.value;
    const deletedAssetsId = arrayDifference(apiPageAssetIds, currentAssetIds);

    assets.forEach(asset =>
      mutateInProject(asset, apiBookAssetIds, currentAssetIds, deletedAssetsId)
    );
    return assets;
  };
  return {
    getCurrentInProjectIds,
    getInProjectAssets,
    updateInProjectAssets
  };
};

export const usePhotos = () => {
  const { isDigitalEdition, generalInfo } = useAppCommon();
  const isDigital = isDigitalEdition.value;

  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { communityId, currentSheet } = useGetters({
    communityId: GETTERS.COMMUNITY_ID,
    currentSheet: GETTERS.CURRENT_SHEET
  });

  const {
    getCurrentInProjectIds,
    getInProjectAssets,
    updateInProjectAssets
  } = useAssets();

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
      ? await getMediaApi(communityId.value, bookId, keywords)
      : await getPhotosApi(communityId.value, bookId, keywords);

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

    return albums || [];
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

  const getUserAvailableAlbums = async () => {
    const albums = await getUserAvailableAlbumApi();

    if (isEmpty(albums)) return [];

    const inProjectIds = await getCurrentInProjectIds();

    albums.forEach(al => {
      updateInProjectAssets(al.assets, inProjectIds);
    });

    return albums;
  };

  const getAlbumCategory = async () => {
    return getAlbumCategoryApi(communityId.value);
  };

  /**
   *  To update media to current sheet
   * @param {Object} media media object
   * @param {Boolean} isDigitalEditor
   * @returns
   */
  const updateSheetMedia = async (media, isDigitalEditor) => {
    const bookId = Number(generalInfo.value.bookId);
    const prefix = isDigitalEditor ? 'digital_' : '';

    const workspace = {
      [`${prefix}properties`]: {
        schema: 1
      },
      [`${prefix}assets`]: media.map(m => m.id)
    };

    const res = await updateSheetApi(currentSheet.value.id, {
      [`${prefix}workspace`]: JSON.stringify(workspace)
    });

    if (!isOk(res)) return;

    const mediaPromises = media.map(m => getAssetByIdApi(m.id, bookId));
    const resMedia = await Promise.all(mediaPromises);

    const inProjectIds = await getCurrentInProjectIds();
    updateInProjectAssets(resMedia, inProjectIds);

    return { media: resMedia, isSuccess: true };
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
    getQrrentById,
    getCurrentInProjectIds,
    updateSheetMedia,
    getUserAvailableAlbums
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

export const useColorPicker = () => {
  const updateColorPicker = async color => {
    const colors = await getPresetsColorPickerApi();

    savePresetColorPickerApi(
      [color, ...colors].slice(0, MAX_COLOR_PICKER_PRESET)
    );
  };

  return { updateColorPicker, getPresets: getPresetsColorPickerApi };
};

export const useText = () => {
  const { setFonts } = useMutations({
    setFonts: APP_MUTATES.SET_FONTS
  });
  const { getFonts: getOriginalFonts } = useGetters({
    getFonts: APP_GETTERS.GET_FONTS
  });

  const getFonts = () => {
    const fonts = getOriginalFonts.value;
    const uniqueFonts = uniqBy(fonts, 'name');
    const sortedFonts = sortBy(uniqueFonts, 'name');

    return sortedFonts.map(({ name, id }) => ({ name, value: id }));
  };

  const loadAllFonts = async () => {
    const fontNames = getFonts().map(font => font.name);

    loadFonts(fontNames);
  };

  const setFontsToStore = async () => {
    const fonts = await getFontsApi();

    setFonts({ fonts });
    loadAllFonts();
  };
  return { getFonts, getOriginalFonts, setFontsToStore };
};

export const useLoadStyles = () => {
  const { loadTextStyles, loadUserTextStyles } = useTextStyle();
  const { loadUserImageStyles } = useImageStyle();
  const { setFontsToStore } = useText();

  const loadStyles = async () => {
    await setFontsToStore();
    loadTextStyles();
    loadUserTextStyles();
    loadUserImageStyles();
  };

  return {
    loadStyles
  };
};

export const useUploadAssets = () => {
  const { isDigitalEdition } = useAppCommon();
  const isDigital = isDigitalEdition.value;

  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { communityId } = useGetters({
    communityId: GETTERS.COMMUNITY_ID
  });

  const { getUploadToken: uploadToken } = useGetters({
    getUploadToken: APP_GETTERS.GET_UPLOAD_TOKEN
  });
  const { setUploadToken } = useMutations({
    setUploadToken: APP_MUTATES.SET_UPLOAD_TOKEN
  });

  const isValidToken = upToken => {
    const { url, token, expiredAt } = upToken;
    // 60000 milisecond
    const isExpire = expiredAt && expiredAt > Date.now() + 60000;

    return url && token && !isExpire;
  };

  const getUploadToken = async () => {
    const currToken = uploadToken.value;

    if (isValidToken(currToken)) {
      return currToken;
    }
    const tokenObject = await getUploadTokenApi();

    const { auth_token_data, upload_url } = tokenObject;
    const { token, expiry_time_in_minutes } = auth_token_data;
    const expiredAt = Date.now() + expiry_time_in_minutes * 60 * 1000;

    const apiToken = {
      token,
      expiredAt,
      url: upload_url
    };

    setUploadToken({ uploadToken: apiToken });

    return apiToken;
  };

  const uploadAssets = async assets => {
    const currToken = await getUploadToken();

    const promises = assets.map(asset => uploadAssetsApi(asset, currToken));

    const results = await Promise.all(promises);

    if (results.some(res => res.status !== 200)) return [];

    // revise the response structure for videos
    const videoTypes = ['video/mp4', 'video/quicktime'];
    results.forEach(({ data }) => {
      const type = get(data, 'mimetype');

      if (!videoTypes.includes(type)) return;

      const { original } = data.versions;
      original.height = 0;
      original.width = 0;
      delete original.preview_url;

      data.versions.web = cloneDeep(original);
    });

    return results.map(res => res.data);
  };

  const updateAlbumAssets = async (id, assets) => {
    return updateAlbumAssetsApi(id, assets);
  };

  const createAlbumAssets = async (title, assets) => {
    const params = { body: title, community_id: communityId.value, assets };

    return createAlbumAssetsApi(params);
  };

  const uploadAssetToAlbum = async (albumId, files, albumName) => {
    const assets = await uploadAssets(files);

    if (isEmpty(assets)) throw new Error('Cannot upload the asset(s)');

    return !albumId
      ? createAlbumAssets(albumName, assets)
      : updateAlbumAssets(albumId, assets);
  };

  return { uploadAssetToAlbum };
};
