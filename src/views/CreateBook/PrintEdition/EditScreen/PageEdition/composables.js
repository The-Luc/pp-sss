import { difference, cloneDeep } from 'lodash';
import { useGetters, useMutations } from 'vuex-composition-helpers';

import { GETTERS as PRINT_GETTERS, MUTATES } from '@/store/modules/print/const';
import {
  savePrintConfigApi,
  savePrintObjectApi,
  updateInProjectApi
} from '@/api/savePrint';
import { getSheetInfoApi } from '@/api/sheet';
import { OBJECT_TYPE, SHEET_TYPE } from '@/common/constants';
import { pageInfoMappingToApi } from '@/common/mapping';
import {
  arrayDifference,
  getPageIdsOfSheet,
  isEmpty,
  isOk,
  mapSheetToPages,
  seperateSheetObjectsIntoPages,
  splitBase64Image
} from '@/common/utils';
import { useThumbnail, usePhotos } from '@/views/CreateBook/composables';
import { useSavePageData, useSyncData } from '@/hooks';

export const useSaveData = () => {
  const { getDataEditScreen, currentSheet, mediaObjectIds } = useGetters({
    getDataEditScreen: PRINT_GETTERS.GET_DATA_EDIT_SCREEN,
    currentSheet: PRINT_GETTERS.CURRENT_SHEET,
    mediaObjectIds: PRINT_GETTERS.GET_MEDIA_OBJECT_IDS
  });
  const { updateThumbnail } = useMutations({
    updateThumbnail: MUTATES.UPDATE_SHEET_THUMBNAIL
  });

  const { uploadBase64Image } = useThumbnail();
  const { getInProjectAssets } = usePhotos();
  const { savePageData } = useSavePageData();
  const { syncToDigital } = useSyncData();

  /**
   * To save print data to DB
   *
   * fields will be saved on page:
   *  show_page_number (spread info)
   *  title (spread info)
   *
   * fields saved on sheet:
   *  is_visited
   *
   * fileds saved on book
   *  pageInfo
   *  default theme id
   *
   * @param {Object} editScreenData sheet data
   * @param {Object} elementMappings sheet element mapping data
   * @returns api response
   */
  const savePrintConfig = async editScreenData => {
    if (isEmpty(editScreenData.sheetProps)) return;

    const screenData = cloneDeep(editScreenData);

    const { pageInfo, bookId, communityId, defaultThemeId } = screenData;
    const { id: sheetId, pageIds, type, isVisited } = screenData.sheetProps;

    const [leftPageId, rightPageId] = getPageIdsOfSheet(pageIds, type);

    const {
      isLeftNumberOn,
      isRightNumberOn,
      leftTitle,
      rightTitle
    } = editScreenData.sheetProps.spreadInfo;

    const leftPage = {
      title: leftTitle,
      show_page_number: isLeftNumberOn
    };

    const rightPage = {
      title: rightTitle,
      show_page_number: isRightNumberOn
    };

    const sheetParams = { is_visited: isVisited };

    const isUpdatePageInfo = type === SHEET_TYPE.COVER;
    const { bookParams, properties } = pageInfoMappingToApi(
      pageInfo,
      communityId,
      defaultThemeId
    );

    const variables = {
      leftId: leftPageId,
      leftParams: leftPage,
      rightId: rightPageId,
      rightParams: rightPage,
      sheetId,
      sheetParams,
      bookId,
      bookParams,
      properties,
      isUpdatePageInfo
    };

    return savePrintConfigApi(variables);
  };

  const savePrintEditScreen = async (
    editScreenData,
    elementMappings,
    isContentChange
  ) => {
    if (isEmpty(editScreenData.sheetProps)) return;

    const promise = [savePrintConfig(editScreenData)];

    isContentChange &&
      promise.push(savePrintObjects(editScreenData, elementMappings));
    return Promise.all(promise);
  };

  /**
   * To save print data to DB
   *
   * fields will be saved on page:
   *  layout/elements
   *  preview_image_url
   *
   * @param {Object} editScreenData sheet data
   * @param {Object} elementMappings sheet element mapping data
   * @returns api response
   */
  const savePrintObjects = async (editScreenData, elementMappings) => {
    const screenData = cloneDeep(editScreenData);

    const { bookId } = screenData;
    const { id: sheetId, pageIds, type, thumbnailUrl } = screenData.sheetProps;

    const [leftPageId, rightPageId] = getPageIdsOfSheet(pageIds, type);

    const { leftThumb, rightThumb } = await splitBase64Image(thumbnailUrl);
    const imgUrls = await Promise.all([
      leftPageId ? uploadBase64Image(leftThumb) : '',
      rightPageId ? uploadBase64Image(rightThumb) : ''
    ]);

    const { leftPage, rightPage } = mapSheetToPages(screenData);
    leftPage.preview_image_url = imgUrls[0];
    rightPage.preview_image_url = imgUrls[1];

    const variables = {
      leftId: leftPageId,
      leftParams: leftPage,
      rightId: rightPageId,
      rightParams: rightPage
    };
    const currentAssetIds = mediaObjectIds.value;

    const { leftPageObjects } = seperateSheetObjectsIntoPages(
      screenData.objects
    );

    const leftAssetIds = leftPageObjects
      .filter(o => o.imageId)
      .map(o => o.imageId);

    const rightAssetIds = arrayDifference(currentAssetIds, leftAssetIds);

    const { leftPageAssetIds, rightPageAssetIds } = await getInProjectAssets(
      bookId,
      pageIds
    );

    const addAssetIdsLeft = difference(leftAssetIds, leftPageAssetIds);
    const addAssetIdsRight = difference(rightAssetIds, rightPageAssetIds);

    const removeAssetIdsLeft = difference(leftPageAssetIds, leftAssetIds);
    const removeAssetIdsRight = difference(rightPageAssetIds, rightAssetIds);

    const inProjectVariablesLeft = {
      bookId: +bookId,
      projectId: pageIds[0],
      addAssetIds: addAssetIdsLeft,
      removeAssetIds: removeAssetIdsLeft
    };
    const inProjectVariablesRight = {
      bookId: +bookId,
      projectId: pageIds[1],
      addAssetIds: addAssetIdsRight,
      removeAssetIds: removeAssetIdsRight
    };

    // update in project mark of assets
    const resOfInProject = await Promise.all([
      updateInProjectApi(inProjectVariablesLeft),
      updateInProjectApi(inProjectVariablesRight)
    ]);

    // update objects and other data
    const isSuccess = await savePrintObjectApi(variables);

    await syncToDigital(sheetId, editScreenData.objects, elementMappings);

    return isSuccess && isOk(resOfInProject);
  };

  /**
   *  To save objects to a sheet
   *
   * @param {String} sheetId id of a sheet
   * @param {Array} objects object will be saved
   * @param {Object} appliedPage indicating whether both pages or one of theme are applied
   * @returns api response
   */
  const savePortraitObjects = async (sheetId, objects, appliedPage) => {
    const getSheetDataFnc = getDataEditScreen.value;
    const sheetData = getSheetDataFnc(sheetId);

    // keep the current backgrounds
    const { objects: sheetObjects } =
      currentSheet.value.id === sheetId
        ? sheetData
        : await getSheetInfoApi(sheetId);

    const backgrounds = sheetObjects.filter(
      ob => ob && ob.type === OBJECT_TYPE.BACKGROUND
    );

    const newObjects = [...backgrounds, ...objects];

    const { leftUrl, rightUrl } = await savePageData(
      sheetId,
      newObjects,
      appliedPage
    );

    // update new thumbnail to store
    const args = { sheetId };
    appliedPage.isLeft && (args.thumbnailLeftUrl = leftUrl);
    appliedPage.isRight && (args.thumbnailRightUrl = rightUrl);

    updateThumbnail(args);
  };

  return { savePrintEditScreen, getDataEditScreen, savePortraitObjects };
};
