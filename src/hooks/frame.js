import {
  useMutations,
  useGetters,
  createNamespacedHelpers
} from 'vuex-composition-helpers';
const { useState: useDigitalState } = createNamespacedHelpers('digital');
import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';
import { MUTATES } from '@/store/modules/app/const';
import { PROPERTIES_TOOLS } from '@/common/constants';
import { cloneDeep } from 'lodash';
import { FrameDetail } from '@/common/models';
import { useLayoutAddingSupport } from '@/hooks';
import { useThumbnail } from '@/views/CreateBook/composables';
import {
  createFrameApi,
  deleteFrameApi,
  updateFrameApi,
  getFramesAndTransitionsApi,
  updateFrameOrderApi
} from '@/api/frame';

/**
 * Get and set common sate of frames
 */
export const useFrame = () => {
  const {
    currentFrame,
    frames,
    currentFrameId,
    firstFrameThumbnail,
    totalFrame,
    frameIds,
    currentFrameIndex
  } = useGetters({
    frames: DIGITAL_GETTERS.GET_ARRAY_FRAMES,
    currentFrame: DIGITAL_GETTERS.CURRENT_FRAME,
    currentFrameId: DIGITAL_GETTERS.CURRENT_FRAME_ID,
    firstFrameThumbnail: DIGITAL_GETTERS.GET_FIRST_FRAME_THUMBNAIL,
    totalFrame: DIGITAL_GETTERS.TOTAL_FRAME,
    frameIds: DIGITAL_GETTERS.GET_FRAME_IDS,
    currentFrameIndex: DIGITAL_GETTERS.CURRENT_FRAME_INDEX
  });

  const {
    setSupplementalLayoutId,
    updateFrameObjects,
    setCurrentFrameId,
    setFrames,
    clearAllFrames
  } = useMutations({
    setSupplementalLayoutId: DIGITAL_MUTATES.SET_SUPPLEMENTAL_LAYOUT_ID,
    setCurrentFrameId: DIGITAL_MUTATES.SET_CURRENT_FRAME_ID,
    updateFrameObjects: DIGITAL_MUTATES.UPDATE_OBJECTS_TO_FRAME,
    setFrames: DIGITAL_MUTATES.SET_FRAMES,
    clearAllFrames: DIGITAL_MUTATES.CLEAR_ALL_FRAMES
  });

  return {
    frames,
    currentFrame,
    currentFrameId,
    setCurrentFrameId,
    setSupplementalLayoutId,
    updateFrameObjects,
    firstFrameThumbnail,
    setFrames,
    totalFrame,
    frameIds,
    currentFrameIndex,
    clearAllFrames
  };
};

/**
 * Get data from frames and set it to store
 * and handling the opening event of Frame Info tab
 */
export const useFrameSwitching = () => {
  const { setPropertiesObjectType, setCurrentFrameVisited } = useMutations({
    setPropertiesObjectType: MUTATES.SET_PROPERTIES_OBJECT_TYPE,
    setCurrentFrameVisited: DIGITAL_MUTATES.SET_FRAME_VISITED
  });

  const handleSwitchFrame = frame => {
    //open frame information panel
    if (!frame.isVisited) {
      setPropertiesObjectType({ type: PROPERTIES_TOOLS.FRAME_INFO.name });
      setCurrentFrameVisited({ value: true });
    }
  };

  return { handleSwitchFrame };
};

/**
 * To handle delete frame event
 * and set active frame after delete
 */
export const useFrameDelete = () => {
  const { framesInStore } = useGetters({
    framesInStore: DIGITAL_GETTERS.GET_ARRAY_FRAMES
  });

  const { deleteFrame, setCurrentFrameId } = useMutations({
    deleteFrame: DIGITAL_MUTATES.DELETE_FRAME,
    setCurrentFrameId: DIGITAL_MUTATES.SET_CURRENT_FRAME_ID
  });

  const handleDeleteFrame = async id => {
    const isSuccess = await deleteFrameApi(id);

    if (!isSuccess) return;

    const oldIndex = framesInStore.value.findIndex(f => f.id === id);

    deleteFrame({ id });

    const newId =
      framesInStore.value[oldIndex]?.id ??
      framesInStore.value[oldIndex - 1]?.id;

    setCurrentFrameId({ id: newId });
  };

  return { handleDeleteFrame };
};

/**
 * To handle replace frame event
 * and set the active frame after replace
 */
export const useFrameReplace = () => {
  const {
    replaceFrame,
    triggerApplyLayout,
    setPropertiesObjectType,
    setIsOpenProperties
  } = useMutations({
    replaceFrame: DIGITAL_MUTATES.REPLACE_SUPPLEMENTAL_FRAME,
    triggerApplyLayout: DIGITAL_MUTATES.UPDATE_TRIGGER_APPLY_LAYOUT,
    setPropertiesObjectType: MUTATES.SET_PROPERTIES_OBJECT_TYPE,
    setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES
  });

  const handleReplaceFrame = async ({ frame, frameId }) => {
    // set the current frame isVisted and open frame info panel
    const newFrame = {
      ...frame,
      isVisited: true,
      fromLayout: false,
      title: '',
      delay: 3
    };

    await updateFrameApi(frameId, newFrame);

    setPropertiesObjectType({ type: PROPERTIES_TOOLS.FRAME_INFO.type });
    setIsOpenProperties({ isOpen: true });

    replaceFrame({ frame: newFrame, frameId });

    // to manually tell the canvas to update itselft because current frame id isn't changed
    triggerApplyLayout();
  };

  return { handleReplaceFrame };
};

/**
 * To handle add frame
 * and set the active frame after add
 */
export const useFrameAdd = () => {
  const { framesInStore, currentSheet } = useGetters({
    framesInStore: DIGITAL_GETTERS.GET_ARRAY_FRAMES,
    currentSheet: DIGITAL_GETTERS.CURRENT_SHEET
  });

  const { addSupplementalFrame, setCurrentFrameId } = useMutations({
    addSupplementalFrame: DIGITAL_MUTATES.ADD_SUPPLEMENTAL_FRAMES,
    setCurrentFrameId: DIGITAL_MUTATES.SET_CURRENT_FRAME_ID
  });

  const { createFrames } = useFrameAction();

  const { getLayoutFrames } = useLayoutAddingSupport();

  const handleAddFrame = async layoutId => {
    const { frames } = await getLayoutFrames(layoutId);

    // adding 1 supplemental frame
    const sheetId = currentSheet.value.id;
    // handleAddFrame func use to add supplemental frame
    // so we set fromLayout = false
    const [frame] = frames;
    frame.fromLayout = false;

    const newFrames = await createFrames(sheetId, [frame]);

    addSupplementalFrame({ frames: newFrames });

    const lastAddedFrame = framesInStore.value[framesInStore.value.length - 1];
    setCurrentFrameId({ id: lastAddedFrame.id });
  };

  return { handleAddFrame };
};

export const useFrameOrdering = () => {
  const { moveFrame } = useMutations({
    moveFrame: DIGITAL_MUTATES.MOVE_FRAME
  });

  const { frameIds } = useGetters({
    frameIds: DIGITAL_GETTERS.GET_FRAME_IDS
  });

  const handleUpdateFrameOrder = async (paramsMoveFrame, sheetId) => {
    moveFrame(paramsMoveFrame);

    const frameOrderIds = frameIds.value.map(id => parseInt(id));

    updateFrameOrderApi(sheetId, frameOrderIds);
  };

  return { handleUpdateFrameOrder, updateFrameOrder: updateFrameOrderApi };
};

export const useFrameTitle = () => {
  const { setFrameTitle } = useMutations({
    setFrameTitle: DIGITAL_MUTATES.SET_TITLE_FRAME
  });

  return { setFrameTitle };
};

export const useFrameDelay = () => {
  const { setFrameDelay } = useMutations({
    setFrameDelay: DIGITAL_MUTATES.SET_FRAME_DELAY
  });

  return { setFrameDelay };
};

export const useFrameAction = () => {
  const { frameIds: frameIdsObs, frames: framesObs } = useDigitalState([
    'frameIds',
    'frames'
  ]);

  const { generateMultiThumbnails } = useThumbnail();

  const getPreviewUrlByIndex = index => {
    const frameIds = frameIdsObs.value;

    if (index >= frameIds.length) return '';

    return framesObs.value[frameIds[index]]?.previewImageUrl;
  };

  const getSheetFrames = async sheetId => {
    if (!sheetId) return;

    const { frames } = await getFramesAndTransitionsApi(sheetId);

    return frames;
  };

  const createFrame = async (sheetId, params) => {
    return createFrameApi(sheetId, params);
  };

  /**
   * Create frames on DB in order and adding frame ids back to frames array
   * @param {string} sheetId
   * @param {array<{}>} frames
   * @returns {Promise<array>} created frames
   */
  const createFrames = async (sheetId, frames) => {
    const responseFrames = [];

    // frames should be created in order so that frame ids will be incrementing numbers
    await frames.reduce(async (acc, f) => {
      // await for the previous item to finish processing
      await acc;

      const frame = await createFrameApi(sheetId, f);
      responseFrames.push(frame);
    }, Promise.resolve());

    // adding frame id
    frames.forEach((frame, index) => (frame.id = responseFrames[index].id));

    return frames;
  };

  const createFramesFromLayout = async (sheetId, layout) => {
    const { isSupplemental } = layout;
    const layoutFrames = cloneDeep(layout.frames);

    const newFrames = layoutFrames.map(frame => {
      const { objects, playInIds, playOutIds, previewImageUrl } = frame;

      return new FrameDetail({
        fromLayout: !isSupplemental,
        objects,
        isVisited: true,
        playInIds,
        playOutIds,
        previewImageUrl
      });
    });

    return createFrames(sheetId, newFrames);
  };

  const updateFramesAndThumbnails = async frames => {
    const imageUrls = await generateMultiThumbnails(
      frames.map(frame => frame.objects),
      true
    );

    // update url into frames
    frames.forEach((frame, idx) => (frame.previewImageUrl = imageUrls[idx]));

    // update frames
    await Promise.all(frames.map(frame => updateFrameApi(frame.id, frame)));
  };

  return {
    getPreviewUrlByIndex,
    createFrame,
    createFrames,
    createFramesFromLayout,
    updateFrameApi,
    getSheetFrames,
    getFramesAndTransitionsApi,
    updateFramesAndThumbnails
  };
};
