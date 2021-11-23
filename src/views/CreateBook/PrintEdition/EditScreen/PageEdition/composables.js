import { isEmpty, mapSheetToPages, pageLayoutsFromSheet } from '@/common/utils';
import { useGetters } from 'vuex-composition-helpers';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { updatePageApi } from '@/api/page';
import { updateSheet, getSheetInfo } from '@/api/sheet';
import { OBJECT_TYPE } from '@/common/constants';

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
   * others:
   *  pageInfo         #4452
   *  default theme id #4452
   *
   * @param {Object} editScreenData sheet data
   * @returns api response
   */
  const savePrintEditScreen = async editScreenData => {
    if (isEmpty(editScreenData.sheetProps)) return;

    const { id: sheetId, pageIds } = editScreenData.sheetProps;
    const [leftPageId, rightPageId] = pageIds;

    const { leftPage, rightPage } = mapSheetToPages(editScreenData);

    const savePromises = [
      updatePageApi(leftPageId, leftPage),
      updatePageApi(rightPageId, rightPage),
      updateSheet(sheetId, { isVisited: false }) // set false until mutation default thumbnail is available
    ];
    return await Promise.all(savePromises);
  };

  /**
   *  To save objects to a sheet
   *
   * @param {String} sheetId id of a sheet
   * @param {Object} objects object will be saved
   * @returns api response
   */
  const savePortraitObjects = async (sheetId, objects) => {
    const getSheetDataFnc = getDataEditScreen.value;
    const sheetData = getSheetDataFnc(sheetId);

    const { pageIds, media } = sheetData.sheetProps;
    const [leftPageId, rightPageId] = pageIds;

    // keep the current backgrounds
    const { objects: sheetObjects } = await getSheetInfo(sheetId);
    const backgrounds = sheetObjects.filter(
      o => o.type === OBJECT_TYPE.BACKGROUND
    );

    const { leftLayout, rightLayout } = pageLayoutsFromSheet({
      media,
      objects: [...backgrounds, ...objects]
    });

    const savePromises = [
      updatePageApi(leftPageId, { layout: leftLayout }),
      updatePageApi(rightPageId, { layout: rightLayout })
    ];

    return await Promise.all(savePromises);
  };

  return { savePrintEditScreen, getDataEditScreen, savePortraitObjects };
};
