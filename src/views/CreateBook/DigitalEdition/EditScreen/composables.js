import { useGetters, useActions } from 'vuex-composition-helpers';

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

  return { saveEditScreen, getDataEditScreen };
};

export const useObject = () => {
  const { updateObjectsToStore } = useActions({
    updateObjectsToStore: ACTIONS.UPDATE_OBJECTS_TO_STORE
  });

  return { updateObjectsToStore };
};
