import { difference } from 'lodash';
import { useGetters, useMutations } from 'vuex-composition-helpers';

import { GETTERS as PRINT_GETTERS, MUTATES } from '@/store/modules/print/const';
import { updatePageApi } from '@/api/page';
import { savePrintDataApi, updateInProjectApi } from '@/api/savePrint';
import { getSheetInfoApi } from '@/api/sheet';
import { OBJECT_TYPE, SHEET_TYPE } from '@/common/constants';
import { pageInfoMappingToApi } from '@/common/mapping';
import {
  arrayDifference,
  getPageIdsOfSheet,
  getSheetThumbnail,
  isEmpty,
  isOk,
  mapSheetToPages,
  pageLayoutsFromSheet,
  seperateSheetObjectsIntoPages,
  splitBase64Image
} from '@/common/utils';
import { useThumbnail, usePhotos } from '@/views/CreateBook/composables';

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

  /**
   * To save print data to DB
   *
   * fields will be saved on page:
   *  layout/elements
   *  preview_image_url
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
   * @param {Boolean} isAutosave indicating autosaving or not
   * @returns api response
   */
  const savePrintEditScreen = async (editScreenData, isAutosave) => {
    if (isEmpty(editScreenData.sheetProps)) return;

    const { pageInfo, bookId, communityId, defaultThemeId } = editScreenData;
    const {
      id: sheetId,
      pageIds,
      type,
      isVisited,
      thumbnailUrl
    } = editScreenData.sheetProps;

    const sheetParams = { is_visited: isVisited };

    const [leftPageId, rightPageId] = getPageIdsOfSheet(pageIds, type);

    const { leftThumb, rightThumb } = await splitBase64Image(thumbnailUrl);
    const imgUrls = await Promise.all([
      leftPageId ? uploadBase64Image(leftThumb, isAutosave) : '',
      rightPageId ? uploadBase64Image(rightThumb, isAutosave) : ''
    ]);

    const { leftPage, rightPage } = mapSheetToPages(editScreenData);
    leftPage.preview_image_url = imgUrls[0];
    rightPage.preview_image_url = imgUrls[1];

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
    const currentAssetIds = mediaObjectIds.value;

    const { leftPageObjects } = seperateSheetObjectsIntoPages(
      editScreenData.objects
    );

    const leftAssetIds = leftPageObjects
      .filter(o => o.imageId)
      .map(o => o.imageId);

    const rightAssetIds = arrayDifference(currentAssetIds, leftAssetIds);

    const { leftPageAssetIds, rightPageAssetIds } = await getInProjectAssets(
      bookId,
      pageIds,
      isAutosave
    );

    const addAssetIdsLeft = difference(leftAssetIds, leftPageAssetIds);
    const addAssetIdsRight = difference(rightAssetIds, rightPageAssetIds);

    const removeAssetIdsLeft = difference(leftPageAssetIds, leftAssetIds);
    const removeAssetIdsRight = difference(rightPageAssetIds, rightAssetIds);
    // console.log('--------------------------');
    // console.log('current asset ', currentAssetIds);
    // console.log('left asset ', leftAssetIds);
    // console.log('right asset ', rightAssetIds);
    // console.log('--------------------------');
    // console.log('left page asset ', leftPageAssetIds);
    // console.log('right page asset ', rightPageAssetIds);
    // console.log('--------------------------');
    // console.log('add assets left ', addAssetIdsLeft);
    // console.log('add assets right ', addAssetIdsRight);
    // console.log('--------------------------');
    // console.log('removeAsset left', removeAssetIdsLeft);
    // console.log('removeAsset right', removeAssetIdsRight);
    // console.log('--------------------------');

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
      updateInProjectApi(inProjectVariablesLeft, isAutosave),
      updateInProjectApi(inProjectVariablesRight, isAutosave)
    ]);

    // update objects and other data
    const isSuccess = await savePrintDataApi(variables, isAutosave);

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

    const { bookId } = sheetData;
    const { pageIds } = sheetData.sheetProps;
    const [leftPageId, rightPageId] = getPageIdsOfSheet(
      pageIds,
      sheetData.sheetProps.type
    );

    // keep the current backgrounds
    const { objects: sheetObjects } =
      currentSheet.value.id === sheetId
        ? sheetData
        : await getSheetInfoApi(sheetId);

    const backgrounds = sheetObjects.filter(
      ob => ob && ob.type === OBJECT_TYPE.BACKGROUND
    );

    const { leftLayout, rightLayout } = pageLayoutsFromSheet([
      ...backgrounds,
      ...objects
    ]);

    const [leftBase64, rightBase64] = await getSheetThumbnail(
      leftLayout.elements,
      rightLayout.elements
    );

    const [leftUrl, rightUrl] = await Promise.all([
      uploadBase64Image(leftBase64),
      uploadBase64Image(rightBase64)
    ]);

    const handleUpdatePage = async (pageId, layout, imgUrl) => {
      const params = {
        layout,
        preview_image_url: imgUrl
      };
      return updatePageApi(pageId, params);
    };
    const savePromises = [];

    if (appliedPage.isLeft) {
      savePromises.push(handleUpdatePage(leftPageId, leftLayout, leftUrl));

      // remove all in-project assets of the page
      const { apiPageAssetIds } = await getInProjectAssets(bookId, leftPageId);
      const inProjectVariables = {
        bookId: +bookId,
        projectId: leftPageId,
        removeAssetIds: apiPageAssetIds
      };
      savePromises.push(updateInProjectApi(inProjectVariables));
    }

    if (appliedPage.isRight) {
      savePromises.push(handleUpdatePage(rightPageId, rightLayout, rightUrl));

      // remove all in-project assets of the page
      const { apiPageAssetIds } = await getInProjectAssets(bookId, rightPageId);
      const inProjectVariables = {
        bookId: +bookId,
        projectId: rightPageId,
        removeAssetIds: apiPageAssetIds
      };
      savePromises.push(updateInProjectApi(inProjectVariables));
    }

    await Promise.all(savePromises);

    // update new thumbnail to store
    const args = { sheetId };
    appliedPage.isLeft && (args.thumbnailLeftUrl = leftUrl);
    appliedPage.isRight && (args.thumbnailRightUrl = rightUrl);

    updateThumbnail(args);
  };

  return { savePrintEditScreen, getDataEditScreen, savePortraitObjects };
};
