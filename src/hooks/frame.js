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

/**
 * Get and set common sate of frames
 */
export const useFrame = () => {
  const {
    currentFrame,
    frames,
    currentFrameId,
    firstFrameThumbnail,
    currentFrameIndex,
    totalFrame
  } = useGetters({
    frames: DIGITAL_GETTERS.GET_FRAMES_WIDTH_IDS,
    currentFrame: DIGITAL_GETTERS.CURRENT_FRAME,
    currentFrameId: DIGITAL_GETTERS.CURRENT_FRAME_ID,
    firstFrameThumbnail: DIGITAL_GETTERS.GET_FIRST_FRAME_THUMBNAIL,
    currentFrameIndex: DIGITAL_GETTERS.CURRENT_FRAME_INDEX,
    totalFrame: DIGITAL_GETTERS.TOTAL_FRAME
  });

  const {
    setSupplementalLayoutId,
    updateFrameObjects,
    setCurrentFrameId
  } = useMutations({
    setSupplementalLayoutId: DIGITAL_MUTATES.SET_SUPPLEMENTAL_LAYOUT_ID,
    setCurrentFrameId: DIGITAL_MUTATES.SET_CURRENT_FRAME_ID,
    updateFrameObjects: DIGITAL_MUTATES.UPDATE_OBJECTS_TO_FRAME
  });

  return {
    frames,
    currentFrame,
    currentFrameId,
    setCurrentFrameId,
    setSupplementalLayoutId,
    updateFrameObjects,
    firstFrameThumbnail,
    currentFrameIndex,
    totalFrame
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
    framesInStore: DIGITAL_GETTERS.GET_FRAMES_WIDTH_IDS
  });

  const { deleteFrame, setCurrentFrameId } = useMutations({
    deleteFrame: DIGITAL_MUTATES.DELETE_FRAME,
    setCurrentFrameId: DIGITAL_MUTATES.SET_CURRENT_FRAME_ID
  });

  const handleDeleteFrame = id => {
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

  const handleReplaceFrame = ({ frame, frameId }) => {
    // set the current frame isVisted and open frame info panel
    frame.isVisited = true;
    setPropertiesObjectType({ type: PROPERTIES_TOOLS.FRAME_INFO.type });
    setIsOpenProperties({ isOpen: true });

    replaceFrame({ frame, frameId });

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
  const { framesInStore } = useGetters({
    framesInStore: DIGITAL_GETTERS.GET_FRAMES_WIDTH_IDS
  });

  const { addSupplementalFrame, setCurrentFrameId } = useMutations({
    addSupplementalFrame: DIGITAL_MUTATES.ADD_SUPPLEMENTAL_FRAMES,
    setCurrentFrameId: DIGITAL_MUTATES.SET_CURRENT_FRAME_ID
  });

  const handleAddFrame = frames => {
    addSupplementalFrame({ frames: cloneDeep(frames) });

    const lastAddedFrame = framesInStore.value[framesInStore.value.length - 1];
    setCurrentFrameId({ id: lastAddedFrame.id });
  };

  return { handleAddFrame };
};

export const useFrameOrdering = () => {
  const { moveFrame } = useMutations({
    moveFrame: DIGITAL_MUTATES.MOVE_FRAME
  });

  return { moveFrame };
};

export const useFrameTitle = () => {
  const { setFrameTitle } = useMutations({
    setFrameTitle: DIGITAL_MUTATES.SET_TITLE_FRAME
  });

  return { setFrameTitle };
};

export const useFrameAction = () => {
  const {
    frameIds: { value: frameIds },
    frames: { value: frames }
  } = useDigitalState(['frameIds', 'frames']);

  const getPreviewUrlByIndex = index => {
    if (index >= frameIds.length) return '';

    return frames[frameIds[index]]?.previewImageUrl;
  };

  return { getPreviewUrlByIndex };
};
