import printService from '@/api/print';
import { isEmpty } from '@/common/utils';
import { useGetters } from 'vuex-composition-helpers';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';

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

  return { savePrintEditScreen, getDataEditScreen };
};
