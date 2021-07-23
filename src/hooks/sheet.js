import { useGetters, useMutations } from 'vuex-composition-helpers';

import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';
import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';

export const useSheet = (isDigital = false) => {
  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { sheetLayout } = useGetters({
    sheetLayout: GETTERS.SHEET_LAYOUT
  });

  return {
    sheetLayout
  };
};

const useMutationEditionSheet = (isDigital = false) => {
  const MUTATES = isDigital ? DIGITAL_MUTATES : PRINT_MUTATES;

  const { setCurrentSheetId } = useMutations({
    setCurrentSheetId: MUTATES.SET_CURRENT_SHEET_ID
  });

  return {
    setCurrentSheetId
  };
};

export const useMutationPrintSheet = () => {
  // adding mutation for print edition only here

  return { ...useMutationEditionSheet() };
};

export const useMutationDigitalSheet = () => {
  // adding mutation for digital edition only here

  return { ...useMutationEditionSheet(true) };
};
