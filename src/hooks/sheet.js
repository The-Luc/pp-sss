import { useGetters, useMutations } from 'vuex-composition-helpers';
import { get } from 'lodash';
import { useAppCommon } from './common';
import { useAnimation } from './animation';
import { useFrame } from './frame';

import { getWorkspaceApi, updateSheetApi } from '@/api/sheet';

import { updatePageWorkspace } from '@/api/page';

import { Transition } from '@/common/models';

import {
  getPlaybackDataFromFrames,
  isEmpty,
  isOk,
  removeItemsFormArray
} from '@/common/utils';

import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';
import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';
import { getAssetByIdApi } from '@/api/media';
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
  const { value: isDigital } = useAppCommon().isDigitalEdition;

  const MUTATES = isDigital ? DIGITAL_MUTATES : PRINT_MUTATES;
  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { currentSheet } = useGetters({
    currentSheet: GETTERS.CURRENT_SHEET
  });

  const { setSheetMedia, deleteMedia } = useMutations({
    setSheetMedia: MUTATES.SET_SHEET_MEDIA,
    deleteMedia: MUTATES.DELETE_SHEET_MEDIA
  });

  const getMedia = async () => {
    const assetIds = await getWorkspaceApi(currentSheet.value.id, isDigital);

    const promises = assetIds.map(id => getAssetByIdApi(id));

    return await Promise.all(promises);
  };

  /**
   *  To update media to current sheet
   * @param {Object} media media object
   * @param {Boolean} isDigital
   * @returns
   */
  const updateSheetMedia = async (media, isDigital) => {
    const prefix = isDigital ? 'digital_' : '';

    const workspace = {
      [`${prefix}properties`]: {
        schema: 1
      },
      [`${prefix}assets`]: media.map(m => m.id)
    };

    const res = await updateSheetApi(currentSheet.value.id, {
      [`${prefix}workspace`]: JSON.stringify(workspace)
    });

    if (!isOk(res)) return;

    const mediaPromises = media.map(m => getAssetByIdApi(m.id));
    const resMedia = await Promise.all(mediaPromises);

    return { media: resMedia, isSuccess: true };
  };

  const deleteSheetMedia = async ({ id, index }) => {
    const pageId = get(currentSheet, 'value.pageIds', [])[0];

    if (!id || !pageId) return;

    const currentMediaIds = currentSheet.value.media.map(m => m.id);

    const assetIds = removeItemsFormArray(currentMediaIds, [{ index }]);

    const res = await updatePageWorkspace(pageId, assetIds);

    if (!isOk(res)) return;

    deleteMedia({ index });
  };

  return {
    getMedia,
    updateSheetMedia,
    deleteSheetMedia,
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
