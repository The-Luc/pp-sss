import { useGetters, useMutations, useActions } from 'vuex-composition-helpers';
import { useAppCommon } from './common';
import { useAnimation } from './animation';
import { useFrame } from './frame';

import {
  getTransitionApi,
  getTransitionsApi,
  addTransitionApi,
  removeTransitionApi,
  applyTransitionApi,
  getPlaybackDataApi
} from '@/api/sheet';

import digitalService from '@/api/digital';
import printService from '@/api/print';

import { Transition } from '@/common/models';

import { getPlaybackDataFromFrames, isEmpty, isOk } from '@/common/utils';

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

  const { sheetLayout, currentSheet, sheetMedia, getSheets } = useGetters({
    sheetLayout: GETTERS.SHEET_LAYOUT,
    currentSheet: GETTERS.CURRENT_SHEET,
    sheetMedia: GETTERS.GET_SHEET_MEDIA,
    getSheets: GETTERS.GET_SHEETS
  });

  return {
    sheetLayout,
    currentSheet,
    sheetMedia,
    getSheets
  };
};

const useMutationEditionSheet = () => {
  const { value: isDigital } = useAppCommon().isDigitalEdition;

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
  const { updateTriggerTransition } = useMutations({
    updateTriggerTransition: DIGITAL_MUTATES.UPDATE_TRIGGER_TRANSITION
  });

  return { ...useMutationEditionSheet(), updateTriggerTransition };
};

export const useGetterDigitalSheet = () => {
  const { triggerTransition, totalPlayOutOrder } = useGetters({
    triggerTransition: DIGITAL_GETTERS.TRIGGER_TRANSITION,
    totalPlayOutOrder: DIGITAL_GETTERS.TOTAL_ANIMATION_PLAY_OUT_ORDER
  });

  return { triggerTransition, totalPlayOutOrder };
};

export const useActionDigitalSheet = () => {
  const { generalInfo: generalInfoObs } = useAppCommon();

  const {
    sheetLayout: sheetLayoutObs,
    currentSheet: currentSheetObs
  } = useSheet();

  const {
    currentFrameId: currentFrameIdObs,
    currentFrame: frameObs,
    frames: framesObs
  } = useFrame();

  const { playInIds: playInIdsObs, playOutIds: playOutIdsObs } = useAnimation();

  const { updateTriggerTransition } = useMutationDigitalSheet();

  const getBookId = () => {
    return generalInfoObs.value.bookId;
  };

  const getTransition = async (sheetId, sectionId, transitionIndex) => {
    return await getTransitionApi(
      getBookId(),
      sheetId,
      sectionId,
      transitionIndex
    );
  };

  const getTransitions = async (sheetId, sectionId) => {
    return await getTransitionsApi(getBookId(), sheetId, sectionId);
  };

  const addTransition = async (sheetId, sectionId, totalTransition = 1) => {
    return await addTransitionApi(
      getBookId(),
      sheetId,
      sectionId,
      totalTransition
    );
  };

  const removeTransition = async (sheetId, sectionId, totalTransition = 1) => {
    return await removeTransitionApi(
      getBookId(),
      sheetId,
      sectionId,
      totalTransition
    );
  };

  const applyTransition = async (
    transition,
    targetType,
    sheetId,
    sectionId,
    transitionIndex
  ) => {
    await applyTransitionApi(
      getBookId(),
      transition,
      targetType,
      sheetId,
      sectionId,
      transitionIndex
    );

    updateTriggerTransition();
  };

  const getCurrentFramePlayback = () => {
    return {
      id: `${currentFrameIdObs.value}`,
      objects: sheetLayoutObs.value,
      playInIds: playInIdsObs.value,
      playOutIds: playOutIdsObs.value,
      delay: frameObs.value.delay,
      transition: {}
    };
  };

  const getFramePlaybackData = async frameId => {
    if (`${frameId}` === `${currentFrameIdObs.value}`) {
      return [getCurrentFramePlayback()];
    }

    const frame = framesObs.value.find(({ id }) => id === frameId);

    const { objects, playInIds, playOutIds, delay } = frame.frame;

    return [
      {
        id: frameId,
        objects,
        playInIds,
        playOutIds,
        delay,
        transition: {}
      }
    ];
  };

  const getCurrentScreenPlaybackData = async () => {
    const currentFrame = getCurrentFramePlayback();
    const currentFrames = framesObs.value;

    const currentScreenId = currentSheetObs.value.id;
    const currentSectionId = currentSheetObs.value.sectionId;

    const currentTransitions = await getTransitions(
      currentScreenId,
      currentSectionId
    );

    return getPlaybackDataFromFrames(currentFrames, currentTransitions, [
      currentFrame
    ]);
  };

  const getAllScreenPlaybackData = async () => {
    const bookPlaybackData = await getPlaybackDataApi(getBookId());

    if (!isOk(bookPlaybackData)) return [];

    const currentScreenPlayback = await getCurrentScreenPlaybackData();

    if (isEmpty(bookPlaybackData.data) && framesObs.value.length > 0) {
      return currentScreenPlayback;
    }

    const playbackData = [];

    bookPlaybackData.data.forEach(({ screenId, data }, index) => {
      const useData =
        screenId === `${currentSheetObs.value.id}`
          ? currentScreenPlayback
          : data;

      if (index < bookPlaybackData.data.length - 1) {
        useData[useData.length - 1].transition = new Transition();
      }

      useData.forEach(d => playbackData.push(d));
    });

    return playbackData;
  };

  return {
    getTransition,
    getTransitions,
    addTransition,
    removeTransition,
    applyTransition,
    getAllScreenPlaybackData,
    getCurrentScreenPlaybackData,
    getFramePlaybackData
  };
};
