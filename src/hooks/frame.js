import { useMutations, useGetters, useActions } from 'vuex-composition-helpers';
// TODO: delete if dont use
import {
  GETTERS as DIGITAL_GETTERS,
  ACTIONS as DIGITAL_ACTIONS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';
import { MUTATES } from '@/store/modules/app/const';
import { DIGITAL_RIGHT_TOOLS } from '@/common/constants';
import { uniqueId } from 'lodash';

/**
 * Get and set common sate of frames
 */
export const useFrame = () => {
  const { currentFrame, frames, currentFrameId } = useGetters({
    frames: DIGITAL_GETTERS.GET_FRAMES_WIDTH_IDS,
    currentFrame: DIGITAL_GETTERS.CURRENT_FRAME,
    currentFrameId: DIGITAL_GETTERS.CURRENT_FRAME_ID
  });

  const { setSupplementalLayoutId, setCurrentFrameId } = useMutations({
    setSupplementalLayoutId: DIGITAL_MUTATES.SET_SUPPLEMENTAL_LAYOUT_ID,
    setCurrentFrameId: DIGITAL_MUTATES.SET_CURRENT_FRAME_ID
  });

  return {
    frames,
    currentFrame,
    currentFrameId,
    setCurrentFrameId,
    setSupplementalLayoutId
  };
};

/**
 * Get data from frames and set it to store
 * and handling the opening event of Frame Info tab
 */
export const useFrameSwitching = () => {
  const { currentFrame } = useGetters({
    currentFrame: DIGITAL_GETTERS.CURRENT_FRAME
  });

  const {
    setPropertiesObjectType,
    setIsOpenProperties,
    setCurrentFrameVisited
  } = useMutations({
    setPropertiesObjectType: MUTATES.SET_PROPERTIES_OBJECT_TYPE,
    setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES,
    setCurrentFrameVisited: DIGITAL_MUTATES.SET_CURRENT_FRAME_VISITED
  });

  const { updateLayoutObjToStore } = useActions({
    updateLayoutObjToStore: DIGITAL_ACTIONS.UPDATE_LAYOUT_OBJ_TO_STORE
  });

  const handleSwitchFrame = () => {
    const layout = currentFrame.value;

    // update to store
    updateLayoutObjToStore({ layout });

    //open frame information panel
    if (!layout.isVisited) {
      setPropertiesObjectType({ type: DIGITAL_RIGHT_TOOLS.FRAME_INFO.value });
      setIsOpenProperties({ isOpen: true });
      setCurrentFrameVisited({ value: true });
    } else {
      setPropertiesObjectType({ type: '' });
      setIsOpenProperties({ isOpen: false });
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
  const { setCurrentFrameId, replaceFrame } = useMutations({
    replaceFrame: DIGITAL_MUTATES.REPLACE_SUPPLEMENTAL_FRAME,
    setCurrentFrameId: DIGITAL_MUTATES.SET_CURRENT_FRAME_ID
  });

  const handleReplaceFrame = ({ frame, frameId }) => {
    const newId = uniqueId();

    replaceFrame({ frame, frameId, newId });

    setCurrentFrameId({ id: newId });
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
    addSupplementalFrame({ frames });

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
