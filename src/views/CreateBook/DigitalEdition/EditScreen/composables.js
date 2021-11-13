import { useGetters, useActions } from 'vuex-composition-helpers';

import { useMutationBook, useActionBook, useAppCommon } from '@/hooks';

import { isEmpty } from '@/common/utils';
import { GETTERS, ACTIONS } from '@/store/modules/digital/const';
import digitalService from '@/api/digital';

export const useSaveData = () => {
  const { getDataEditScreen } = useGetters({
    getDataEditScreen: GETTERS.GET_DATA_EDIT_SCREEN
  });

  const saveEditScreen = async editScreenData => {
    if (isEmpty(editScreenData.sheet)) return;

    const sheetId = editScreenData.sheet.id;

    const { data, status } = await digitalService.saveEditScreen(
      sheetId,
      editScreenData
    );

    return {
      data,
      status
    };
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

    const { communityId, themeId, isPhotoVisited, title } = book;

    setBookInfo({
      info: {
        communityId,
        defaultThemeId: themeId,
        isPhotoVisited
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
