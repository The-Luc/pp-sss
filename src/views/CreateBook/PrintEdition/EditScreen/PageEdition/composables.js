import printService from '@/api/print';
import { isEmpty } from '@/common/utils';
import { useGetters } from 'vuex-composition-helpers';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { updatePagesOfSheet } from '@/api/page';

export const useSaveData = () => {
  const { getDataEditScreen } = useGetters({
    getDataEditScreen: PRINT_GETTERS.GET_DATA_EDIT_SCREEN
  });

  const savePrintEditScreen = async editScreenData => {
    if (isEmpty(editScreenData.sheetProps)) return;

    return await updatePagesOfSheet(editScreenData);
  };

  const savePortraitObjects = async (sheetId, objects) => {
    return printService.saveObjectsAndBackground(sheetId, objects, true);
  };

  return { savePrintEditScreen, getDataEditScreen, savePortraitObjects };
};
