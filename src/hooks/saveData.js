import { updatePageApi } from '@/api/page';
import { updateInProjectApi } from '@/api/savePrint';
import { getSheetInfoApi } from '@/api/sheet';
import {
  getPageIdsOfSheet,
  pageLayoutsFromSheet,
  getSheetThumbnail
} from '@/common/utils';
import { useThumbnail, usePhotos } from '@/views/CreateBook/composables';

export const useSavePageData = () => {
  const { uploadBase64Image } = useThumbnail();
  const { getInProjectAssets } = usePhotos();

  /**
   *
   * @param {Object} option {midCanvas, isForceToRight}
   * midCanvas: mid of canvas, this is used when save page from digital (mapping feature)
   * isForceToRight: true when use apply on inside front cover sheet, so all object must belong to right page
   * @returns
   */
  const savePageData = async (sheetId, objects, appliedPage, option) => {
    const sheet = await getSheetInfoApi(sheetId);
    const { bookId, pageIds, sheetType } = sheet;

    const [leftPageId, rightPageId] = getPageIdsOfSheet(pageIds, sheetType);

    const { leftLayout, rightLayout } = pageLayoutsFromSheet(objects, option);

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

    return { leftUrl, rightUrl };
  };

  return { savePageData };
};
