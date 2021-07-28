import printService from '@/api/print';
import { useGetters } from 'vuex-composition-helpers';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';

export const useSaveData = () => {
  const { sheets } = useGetters({
    sheets: PRINT_GETTERS.GET_SHEETS
  });

  const savePrintMainScreen = async sheets => {
    const data = {};

    Object.values(sheets).forEach(sheet => {
      const props = {
        link: sheet.link
      };

      data[sheet.id] = props;
    });
    await printService.saveMainScreen(data);
  };

  return { savePrintMainScreen, sheets };
};
