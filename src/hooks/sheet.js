import { useGetters, useMutations } from 'vuex-composition-helpers';

import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';
import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';
import { isEmpty } from '@/common/utils';
import printService from '@/api/print';

export const useSheet = (isDigital = false) => {
  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { sheetLayout, currentSheet } = useGetters({
    sheetLayout: GETTERS.SHEET_LAYOUT,
    currentSheet: GETTERS.CURRENT_SHEET
  });

  return {
    sheetLayout,
    currentSheet
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

export const useSaveData = () => {
  const {
    getObjectsAndBackgrounds,
    sheetById,
    defaultThemeId,
    pageInfo,
    sheets
  } = useGetters({
    getObjectsAndBackgrounds: PRINT_GETTERS.GET_OBJECTS_AND_BACKGROUNDS,
    defaultThemeId: PRINT_GETTERS.DEFAULT_THEME_ID,
    pageInfo: PRINT_GETTERS.GET_PAGE_INFO,
    sheetById: PRINT_GETTERS.SHEET_BY_ID,
    sheets: PRINT_GETTERS.GET_SHEETS
  });
  const savePrintEditScreen = async sheetId => {
    const getSheetFunc = sheetById.value;
    const objects = getObjectsAndBackgrounds.value;
    const objectData = objects.map(o => o.object);
    const sheetProps = getSheetFunc(sheetId);

    if (isEmpty(sheetProps)) return;

    const dataToSave = {
      objects: objectData,
      defaultThemeId: defaultThemeId.value,
      pageInfo: pageInfo.value,
      sheetProps
    };

    const { data, status } = await printService.saveEditScreen(
      sheetId,
      dataToSave
    );
    return {
      data,
      status
    };
  };

  const savePrintMainScreen = async () => {
    const sheetData = sheets.value;

    const data = {};

    Object.values(sheetData).forEach(sheet => {
      const props = {
        link: sheet.link
      };

      data[sheet.id] = props;
    });
    await printService.saveMainScreen(data);
  };

  return { savePrintEditScreen, savePrintMainScreen };
};

export const useMutationPrintSheet = () => {
  // adding mutation for print edition only here

  return { ...useMutationEditionSheet() };
};

export const useMutationDigitalSheet = () => {
  // adding mutation for digital edition only here

  return { ...useMutationEditionSheet(true) };
};
