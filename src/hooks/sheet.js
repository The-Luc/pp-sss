import { useGetters } from 'vuex-composition-helpers';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';

export const useSheet = (isDigital = false) => {
  const GETTETS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;
  const { sheetLayout } = useGetters({
    sheetLayout: GETTETS.SHEET_LAYOUT
  });
  return {
    sheetLayout
  };
};
