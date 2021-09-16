import printService from '@/api/print';
import { isEmpty } from '@/common/utils';
import { useGetters, useMutations } from 'vuex-composition-helpers';
import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';

export const useSaveData = () => {
  const { getDataEditScreen } = useGetters({
    getDataEditScreen: PRINT_GETTERS.GET_DATA_EDIT_SCREEN
  });

  const savePrintEditScreen = async editScreenData => {
    if (isEmpty(editScreenData.sheetProps)) return;

    const sheetId = editScreenData.sheetProps.id;

    const { data, status } = await printService.saveEditScreen(
      sheetId,
      editScreenData
    );

    return {
      data,
      status
    };
  };

  const savePortraitObjects = async (sheetId, objects) => {
    return await printService.saveObjectsAndBackground(sheetId, objects);
  };

  return { savePrintEditScreen, getDataEditScreen, savePortraitObjects };
};

export const useBookObjects = () => {
  const { addObjecs, deleteObjects } = useMutations({
    addObjecs: PRINT_MUTATES.ADD_OBJECTS,
    deleteObjects: PRINT_MUTATES.DELETE_OBJECTS
  });

  return {
    addObjecs,
    deleteObjects
  };
};
