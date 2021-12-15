import { useGetters, useActions } from 'vuex-composition-helpers';

import { useMutationBook, useActionBook, useAppCommon } from '@/hooks';

import { isEmpty } from '@/common/utils';
import { GETTERS, ACTIONS } from '@/store/modules/digital/const';
import digitalService from '@/api/digital';
import { mappingFrameToApi } from '@/common/mapping/frame';
import { saveDigitalDataApi } from '@/api/saveDigital';

export const useSaveData = () => {
  const { getDataEditScreen } = useGetters({
    getDataEditScreen: GETTERS.GET_DATA_EDIT_SCREEN
  });

  /**
   * To save digital data to DB
   *
   * fields will be saved on frame:
   *  title
   *  objects
   *  preview_image_url   # wait to a solution to upload images
   *  frame_delay
   *  is_visited
   *  play_in_ids
   *  play_out_ids
   *  frame_order
   *
   * fileds saved on book
   *  default theme id
   *
   * @param {Object} editScreenData sheet data
   * @returns api response
   */
  const saveEditScreen = async editScreenData => {
    const { frame, defaultThemeId, bookId } = editScreenData;

    if (isEmpty(frame)) return;

    const variables = {
      bookId,
      bookParams: { digital_theme_id: parseInt(defaultThemeId) },
      frameId: frame.id,
      frameParams: mappingFrameToApi(frame)
    };
    variables.frameParams.objects = frame.objects.map(o => JSON.stringify(o));

    return await saveDigitalDataApi(variables);
  };

  const saveAnimationConfig = async animationConfig => {
    return digitalService.saveAnimationConfig(animationConfig);
  };

  const saveSheetFrames = async (sheetId, frames) => {
    return digitalService.updateSheet(sheetId, {
      frames,
      isVisited: true
    });
  };

  return {
    saveEditScreen,
    getDataEditScreen,
    saveAnimationConfig,
    saveSheetFrames
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
