import { useGetters, useMutations, useActions } from 'vuex-composition-helpers';
import { useAppCommon } from './common';

import {
  getTransitionsApi,
  addTransitionApi,
  removeTransitionApi,
  updateTransitionApi
} from '@/api/sheet';

import digitalService from '@/api/digital';
import printService from '@/api/print';

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

export const useSheet = () => {
  const { value: isDigital } = useAppCommon().isDigitalEdition;

  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { sheetLayout, currentSheet, sheetMedia } = useGetters({
    sheetLayout: GETTERS.SHEET_LAYOUT,
    currentSheet: GETTERS.CURRENT_SHEET,
    sheetMedia: GETTERS.GET_SHEET_MEDIA
  });

  return {
    sheetLayout,
    currentSheet,
    sheetMedia
  };
};

const useMutationEditionSheet = (isDigital = false) => {
  const MUTATES = isDigital ? DIGITAL_MUTATES : PRINT_MUTATES;

  const { setCurrentSheetId, updateSheetThumbnail } = useMutations({
    setCurrentSheetId: MUTATES.SET_CURRENT_SHEET_ID,
    updateSheetThumbnail: MUTATES.UPDATE_SHEET_THUMBNAIL
  });

  return {
    setCurrentSheetId,
    updateSheetThumbnail
  };
};

export const useActionsEditionSheet = () => {
  const { value: isDigital } = useAppCommon().isDigitalEdition;

  const MUTATES = isDigital ? DIGITAL_MUTATES : PRINT_MUTATES;
  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;
  const ACTIONS = isDigital ? DIGITAL_ACTIONS : PRINT_ACTIONS;

  const { currentSheet } = useGetters({
    currentSheet: GETTERS.CURRENT_SHEET
  });

  const { setSheetMedia } = useMutations({
    setSheetMedia: MUTATES.SET_SHEET_MEDIA
  });

  const { updateSheetMedia } = useActions({
    updateSheetMedia: ACTIONS.UPDATE_SHEET_MEDIA
  });

  const deleteSheetMedia = async ({ id }) => {
    if (!id) return;

    isDigital
      ? await digitalService.deleteSheetMediaById(currentSheet.value.id, id)
      : await printService.deleteSheetMediaById(currentSheet.value.id, id);

    const media = isDigital
      ? await digitalService.getSheetMedia(currentSheet.value.id)
      : await printService.getSheetMedia(currentSheet.value.id);

    await setSheetMedia({ media });
  };

  return {
    updateSheetMedia,
    deleteSheetMedia
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

export const useDigitalSheetAction = () => {
  return {
    getTransitions: getTransitionsApi,
    addTransition: addTransitionApi,
    removeTransition: removeTransitionApi,
    updateTransition: updateTransitionApi
  };
};
