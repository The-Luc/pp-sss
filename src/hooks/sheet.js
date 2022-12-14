import { useGetters, useMutations } from 'vuex-composition-helpers';
import { useAppCommon } from './common';
import { useAnimation } from './animation';
import { useFrame } from './frame';

import { Transition } from '@/common/models';

import { getPlaybackDataFromFrames, isEmpty, isOk } from '@/common/utils';

import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';
import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';
import { getFramesAndTransitionsApi } from '@/api/frame';
import { TRANSITION, TRANS_TARGET } from '@/common/constants';
import { updateTransitionApi } from '@/api/playback';
import { getPlaybackDataApi } from '@/api/playback/api_query';

export const useSheet = () => {
  const { value: isDigital } = useAppCommon().isDigitalEdition;

  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { sheetLayout, currentSheet, getSheets, sheetMedia } = useGetters({
    sheetLayout: GETTERS.SHEET_LAYOUT,
    currentSheet: GETTERS.CURRENT_SHEET,
    getSheets: GETTERS.GET_SHEETS,
    sheetMedia: GETTERS.GET_SHEET_MEDIA
  });

  return {
    sheetLayout,
    currentSheet,
    getSheets,
    sheetMedia
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
  const { isDigitalEdition } = useAppCommon();

  const isDigital = isDigitalEdition.value;

  const MUTATES = isDigital ? DIGITAL_MUTATES : PRINT_MUTATES;

  const { setSheetMedia } = useMutations({
    setSheetMedia: MUTATES.SET_SHEET_MEDIA
  });

  return {
    setSheetMedia
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

  const getTransition = async (sheetId, transitionIndex) => {
    const { transitions } = await getFramesAndTransitionsApi(sheetId);
    return transitions[transitionIndex];
  };

  const getTransitions = async sheetId => {
    const { transitions } = await getFramesAndTransitionsApi(sheetId);
    return transitions;
  };

  const applyTransition = async (
    transition,
    targetType,
    sheetId,
    sectionId
  ) => {
    if (transition.transition === TRANSITION.NONE) {
      transition.direction = -1;
      transition.duration = 0;
    }

    if (transition.transition === TRANSITION.DISSOLVE) {
      transition.direction = -1;
    }

    const idOpts = {
      [TRANS_TARGET.SELF]: transition.id,
      [TRANS_TARGET.SHEET]: sheetId,
      [TRANS_TARGET.SECTION]: sectionId,
      [TRANS_TARGET.ALL]: getBookId()
    };

    const isSuccess = await updateTransitionApi(
      idOpts[targetType],
      transition,
      targetType
    );

    if (!isSuccess) return;

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

    const { objects, playInIds, playOutIds, delay } = frame;

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

    const currentTransitions = await getTransitions(currentScreenId);

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
    applyTransition,
    getAllScreenPlaybackData,
    getCurrentScreenPlaybackData,
    getFramePlaybackData
  };
};
