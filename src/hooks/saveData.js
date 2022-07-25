import { updatePageApi } from '@/api/page';
import { updateInProjectApi } from '@/api/savePrint';
import { getSheetInfoApi } from '@/api/sheet';
import { IMAGE_LOCAL } from '@/common/constants';
import {
  getPageIdsOfSheet,
  pageLayoutsFromSheet,
  getSheetThumbnail,
  isEmpty
} from '@/common/utils';
import { useThumbnail, usePhotos } from '@/views/CreateBook/composables';
import { useMappingSheet } from './mapping';

export const useSavePageData = () => {
  const { uploadBase64Image } = useThumbnail();
  const { getInProjectAssets } = usePhotos();
  const { removeElementMappingOfPage } = useMappingSheet();

  /**
   *
   * @param {Object} appliedPage optional
   * @param {Object} option {isForceToRight}
   * isForceToRight: true when user apply on inside front cover sheet, so all object must belong to right page
   * @returns
   */
  const savePageData = async (sheetId, objects, appliedPage, option) => {
    const sheet = await getSheetInfoApi(sheetId);
    const { bookId, pageIds, type: sheetType } = sheet;

    const [leftPageId, rightPageId] = getPageIdsOfSheet(pageIds, sheetType);

    const { leftLayout, rightLayout } = pageLayoutsFromSheet(objects, option);

    let leftUrl, rightUrl;

    if (isEmpty(objects)) {
      leftUrl = rightUrl = IMAGE_LOCAL.BLANK_THUMB;
    } else {
      const [leftBase64, rightBase64] = await getSheetThumbnail(
        leftLayout.elements,
        rightLayout.elements
      );

      [leftUrl, rightUrl] = await Promise.all([
        uploadBase64Image(leftBase64),
        uploadBase64Image(rightBase64)
      ]);
    }

    const handleUpdatePage = async (pageId, layout, imgUrl) => {
      const params = {
        layout,
        preview_image_url: imgUrl
      };
      return updatePageApi(pageId, params);
    };
    const savePromises = [];

    const isOnLeft = appliedPage ? appliedPage.isLeft : Boolean(leftPageId);
    const isOnRight = appliedPage ? appliedPage.isRight : Boolean(rightPageId);

    if (isOnLeft) {
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

    if (isOnRight) {
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

    // remove mapping elements on sheet
    if (isOnRight || isOnLeft) await removeElementMappingOfPage(sheetId);

    return { leftUrl, rightUrl };
  };

  return { savePageData };
};
