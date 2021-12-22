import { useGetters, useMutations } from 'vuex-composition-helpers';

import { GETTERS as PRINT_GETTERS, MUTATES } from '@/store/modules/print/const';
import { updatePageApi } from '@/api/page';
import { savePrintDataApi } from '@/api/savePrint';
import { getSheetInfoApi } from '@/api/sheet';
import { OBJECT_TYPE, SHEET_TYPE } from '@/common/constants';
import { pageInfoMappingToApi } from '@/common/mapping';
import { uploadBase64ImageApi } from '@/api/util';
import {
  getPageIdsOfSheet,
  getSheetThumbnail,
  isEmpty,
  mapSheetToPages,
  pageLayoutsFromSheet,
  splitBase64Image
} from '@/common/utils';

export const useSaveData = () => {
  const { getDataEditScreen, currentSheet } = useGetters({
    getDataEditScreen: PRINT_GETTERS.GET_DATA_EDIT_SCREEN,
    currentSheet: PRINT_GETTERS.CURRENT_SHEET
  });
  const { updateThumbnail } = useMutations({
    updateThumbnail: MUTATES.UPDATE_SHEET_THUMBNAIL
  });

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
      leftPageId ? uploadBase64ImageApi(leftThumb, isAutosave) : '',
      rightPageId ? uploadBase64ImageApi(rightThumb, isAutosave) : ''
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

    const isSuccess = await savePrintDataApi(variables, isAutosave);

    return isSuccess;
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
      uploadBase64ImageApi(leftBase64),
      uploadBase64ImageApi(rightBase64)
    ]);

    const handleUpdatePage = async (pageId, layout, imgUrl) => {
      const params = {
        layout,
        preview_image_url: imgUrl
      };
      return updatePageApi(pageId, params);
    };

    const savePromises = [
      appliedPage.isLeft && handleUpdatePage(leftPageId, leftLayout, leftUrl),
      appliedPage.isRight &&
        handleUpdatePage(rightPageId, rightLayout, rightUrl)
    ];

    await Promise.all(savePromises);

    // update new thumbnail to store
    const args = { sheetId };
    appliedPage.isLeft && (args.thumbnailLeftUrl = leftUrl);
    appliedPage.isRight && (args.thumbnailRightUrl = rightUrl);

    updateThumbnail(args);
  };

  return { savePrintEditScreen, getDataEditScreen, savePortraitObjects };
};
