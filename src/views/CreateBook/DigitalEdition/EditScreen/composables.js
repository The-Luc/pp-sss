import { useGetters, useActions } from 'vuex-composition-helpers';

import { useMutationBook, useActionBook, useAppCommon } from '@/hooks';

import { isEmpty } from '@/common/utils';
import { GETTERS, ACTIONS } from '@/store/modules/digital/const';
import digitalService from '@/api/digital';
import { getMedia, searchMedia } from '@/api/photo';

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

  return { saveEditScreen, getDataEditScreen };
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

  const { getBookInfo } = useActionBook(true);

  const getBookDigitalInfo = async bookId => {
    const {
      themeId,
      isPhotoVisited,
      title,
      sectionsSheets
    } = await getBookInfo(bookId);

    setBookInfo({ info: { defaultThemeId: themeId } });

    setSectionsSheets({ sectionsSheets });

    setGeneralInfo({
      info: {
        bookId,
        title,
        isPhotoVisited
      }
    });
  };

  return {
    getBookDigitalInfo
  };
};

export const useGetMedia = () => {
  const getSmartboxMedia = async keywords => {
    const listPhotos = await getMedia(keywords);
    return listPhotos;
  };

  const getSearchMedia = async input => {
    const listPhotos = await searchMedia(input);
    return listPhotos;
  };

  return {
    getSmartboxMedia,
    getSearchMedia
  };
};
