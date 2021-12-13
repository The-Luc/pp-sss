import {
  getPageIdsOfSheet,
  isEmpty,
  mapSheetToPages,
  pageLayoutsFromSheet
} from '@/common/utils';
import { useGetters } from 'vuex-composition-helpers';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { updatePageApi } from '@/api/page';
import { savePrintDataApi } from '@/api/savePrint';
import { getSheetInfoApi } from '@/api/sheet';
import { OBJECT_TYPE, SHEET_TYPE } from '@/common/constants';
import { pageInfoMappingToApi } from '@/common/mapping';

export const useSaveData = () => {
  const { getDataEditScreen } = useGetters({
    getDataEditScreen: PRINT_GETTERS.GET_DATA_EDIT_SCREEN
  });

  /**
   * To save print data to DB
   *
   * fields will be saved on page:
   *  layout/elements
   *  layout/workspace
   *  preview_image_url           # wait to a solution to upload images
   *  show_page_number (spread info)
   *  title (spread info)
   *
   * fields saved on sheet:
   *  is_visited
   *
   * fileds saved on book
   *  pageInfo
   *  default theme id #4452
   *
   * @param {Object} editScreenData sheet data
   * @returns api response
   */
  const savePrintEditScreen = async editScreenData => {
    if (isEmpty(editScreenData.sheetProps)) return;

    const { pageInfo, bookId, communityId } = editScreenData;
    const sheetParams = { is_visited: false }; // set false until mutation default thumbnail is available
    const { id: sheetId, pageIds, type } = editScreenData.sheetProps;
    const [leftPageId, rightPageId] = getPageIdsOfSheet(pageIds, type);

    const { leftPage, rightPage } = mapSheetToPages(editScreenData);

    const isUpdatePageInfo = type === SHEET_TYPE.COVER;

    const { bookParams, properties } = pageInfoMappingToApi(
      pageInfo,
      communityId
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

    const isSuccess = await savePrintDataApi(variables);

    return isSuccess;
  };

  /**
   *  To save objects to a sheet
   *
   * @param {String} sheetId id of a sheet
   * @param {Object} objects object will be saved
   * @returns api response
   */
  const savePortraitObjects = async (sheetId, objects, appliedPage) => {
    const getSheetDataFnc = getDataEditScreen.value;
    const sheetData = getSheetDataFnc(sheetId);

    const { pageIds, media } = sheetData.sheetProps;
    const [leftPageId, rightPageId] = pageIds;

    // keep the current backgrounds
    const { objects: sheetObjects } = await getSheetInfoApi(sheetId);
    const backgrounds = sheetObjects.filter(
      o => o.type === OBJECT_TYPE.BACKGROUND
    );

    const { leftLayout, rightLayout } = pageLayoutsFromSheet({
      media,
      objects: [...backgrounds, ...objects]
    });

    const savePromises = [
      appliedPage.isLeft && updatePageApi(leftPageId, { layout: leftLayout }),
      appliedPage.isRight && updatePageApi(rightPageId, { layout: rightLayout })
    ];

    return await Promise.all(savePromises);
  };

  return { savePrintEditScreen, getDataEditScreen, savePortraitObjects };
};
