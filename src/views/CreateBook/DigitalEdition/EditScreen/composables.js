import { difference } from 'lodash';
import { useGetters, useActions } from 'vuex-composition-helpers';

import {
  useMutationBook,
  useActionBook,
  useAppCommon,
  useSyncData
} from '@/hooks';

import { isEmpty, isOk } from '@/common/utils';
import { GETTERS, ACTIONS } from '@/store/modules/digital/const';
import {
  mappingFrameConfigToApi,
  mappingFrameToApi
} from '@/common/mapping/frame';
import { saveDigitalConfigApi, saveDigitalObjectsApi } from '@/api/saveDigital';
import { uploadBase64ImageApi } from '@/api/util';
import { usePhotos } from '../../composables';
import { updateInProjectApi } from '@/api/savePrint';
import { useLoadStyles } from '@/views/CreateBook/composables';

export const useSaveData = () => {
  const { getDataEditScreen, mediaObjectIds } = useGetters({
    getDataEditScreen: GETTERS.GET_DATA_EDIT_SCREEN,
    mediaObjectIds: GETTERS.GET_MEDIA_OBJECT_IDS
  });
  const { getInProjectAssets } = usePhotos();
  const { syncToPrint } = useSyncData();

  const saveEditScreen = async (
    data,
    isAutosave,
    elementMappings,
    isContentChange
  ) => {
    if (isEmpty(data.frame)) return;

    const promise = [saveDigitalConfig(data, isAutosave)];

    isContentChange &&
      promise.push(saveDigitalObjects(data, isAutosave, elementMappings));

    return Promise.all(promise);
  };

  /**
   * To save digital data to DB
   *
   * fields will be saved on frame:
   *  title
   *  frame_delay
   *  is_visited
   *  frame_order
   *
   * fileds saved on book
   *  default theme id
   *
   * @param {Object} editScreenData sheet data
   * @param {Boolean} isAutosave indicating autosaving call or not
   * @returns api response
   */
  const saveDigitalConfig = async (editScreenData, isAutosave) => {
    const { frame, defaultThemeId, bookId } = editScreenData;

    if (isEmpty(frame)) return;

    const variables = {
      bookId,
      bookParams: { digital_theme_id: parseInt(defaultThemeId) },
      frameId: frame.id,
      frameParams: mappingFrameConfigToApi(frame)
    };

    // update objects and other data
    return saveDigitalConfigApi(variables, isAutosave);
  };

  /**
   * To save digital data to DB
   *
   * fields will be saved on frame:
   *  objects
   *  preview_image_url
   *  play_in_ids
   *  play_out_ids
   *
   *
   * @param {Object} editScreenData sheet data
   * @param {Boolean} isAutosave indicating autosaving call or not
   * @returns api response
   */
  const saveDigitalObjects = async (
    editScreenData,
    isAutosave,
    elementMappings
  ) => {
    const { frame, bookId, sheetId } = editScreenData;

    if (isEmpty(frame)) return;

    const imgUrl = await uploadBase64ImageApi(
      frame.previewImageUrl,
      isAutosave
    );
    frame.previewImageUrl = isOk(imgUrl) ? imgUrl.data : '';

    const variables = {
      frameId: frame.id,
      frameParams: mappingFrameToApi(frame)
    };

    const projectId = +frame.id;
    const currentAssetIds = mediaObjectIds.value;
    const { apiPageAssetIds } = await getInProjectAssets(
      bookId,
      projectId,
      isAutosave
    );

    const addAssetIds = difference(currentAssetIds, apiPageAssetIds);

    const removeAssetIds = difference(apiPageAssetIds, currentAssetIds);

    const inProjectVariables = {
      bookId: +bookId,
      projectId,
      addAssetIds,
      removeAssetIds
    };

    // update in project mark of assets
    const isSuccessOfInProject = await updateInProjectApi(
      inProjectVariables,
      isAutosave,
      true
    );

    // update objects and other data
    const isSuccess = await saveDigitalObjectsApi(variables, isAutosave);

    await syncToPrint(sheetId, frame, elementMappings);

    return isSuccess && isSuccessOfInProject;
  };

  return {
    saveEditScreen,
    getDataEditScreen
  };
};

export const useObject = () => {
  const { updateObjectsToStore } = useActions({
    updateObjectsToStore: ACTIONS.UPDATE_OBJECTS_TO_STORE
  });

  return { updateObjectsToStore };
};

export const useBookDigitalInfo = () => {
  const { setBookInfo, setSectionsSheets } = useMutationBook(true);

  const { setGeneralInfo } = useAppCommon();
  const { loadStyles } = useLoadStyles();

  const { getBookInfo } = useActionBook();

  const getBookDigitalInfo = async bookId => {
    const { book, sections, sheets } = await getBookInfo(bookId, true);

    setSectionsSheets({ sections, sheets });

    const { communityId, themeId, isPhotoVisited, bookUserId, title } = book;

    setBookInfo({
      info: {
        id: bookId,
        communityId,
        defaultThemeId: themeId,
        isPhotoVisited,
        bookUserId
      }
    });

    setGeneralInfo({ info: { bookId, title } });
    await loadStyles();
  };

  return {
    getBookDigitalInfo
  };
};

export const useVideo = () => {
  const { totalVideoDuration } = useGetters({
    totalVideoDuration: GETTERS.GET_TOTAL_VIDEO_DURATION
  });

  return { totalVideoDuration };
};
