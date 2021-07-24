import { useGetters, useMutations, useActions } from 'vuex-composition-helpers';

import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES,
  ACTIONS as PRINT_ACTIONS
} from '@/store/modules/print/const';
import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES,
  ACTIONS as DIGITAL_ACTIONS
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

// TODO -Luc: Revised it soon
export const useSaveSpreadInfo = (isDigital = false) => {
  const ACTIONS = isDigital ? DIGITAL_ACTIONS : PRINT_ACTIONS;

  const { setSpreadInfo } = useActions({
    setSpreadInfo: ACTIONS.SAVE_SPREAD_INFO
  });

  return { setSpreadInfo };
};
export const useSaveSheetThumbnail = (isDigital = false) => {
  const ACTIONS = isDigital ? DIGITAL_ACTIONS : PRINT_ACTIONS;

  const { setThumbnail } = useActions({
    setThumbnail: ACTIONS.SAVE_SHEET_THUMBNAIL
  });

  return { setThumbnail };
};
export const useMutationPrintSheet = () => {
  // adding mutation for print edition only here

  return { ...useMutationEditionSheet() };
};

export const useMutationDigitalSheet = () => {
  // adding mutation for digital edition only here

  return { ...useMutationEditionSheet(true) };
};
