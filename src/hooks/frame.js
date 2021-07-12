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
 * Handle basic action of a frame
 * Add frame, replace frame, delete frame, switch frames
 *
 */
export const useFrameAction = () => {
  const { currentFrame, framesInStore } = useGetters({
    currentFrame: DIGITAL_GETTERS.CURRENT_FRAME,
    framesInStore: DIGITAL_GETTERS.GET_FRAMES_WIDTH_IDS
  });

  const {
    setPropertiesObjectType,
    setIsOpenProperties,
    setCurrentFrameVisited,
    addSupplementalFrame,
    replaceFrame,
    deleteFrame,
    setCurrentFrameId
  } = useMutations({
    setPropertiesObjectType: MUTATES.SET_PROPERTIES_OBJECT_TYPE,
    setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES,
    setCurrentFrameVisited: DIGITAL_MUTATES.SET_CURRENT_FRAME_VISITED,
    addSupplementalFrame: DIGITAL_MUTATES.ADD_SUPPLEMENTAL_FRAMES,
    replaceFrame: DIGITAL_MUTATES.REPLACE_SUPPLEMENTAL_FRAME,
    deleteFrame: DIGITAL_MUTATES.DELETE_FRAME,
    setCurrentFrameId: DIGITAL_MUTATES.SET_CURRENT_FRAME_ID
  });

  const { updateLayoutObjToStore } = useActions({
    updateLayoutObjToStore: DIGITAL_ACTIONS.UPDATE_LAYOUT_OBJ_TO_STORE
  });

  /**
   * Get data from frames and set it to store
   * and handling the opening event of Frame Info tab
   */
  const handleChangeFrame = () => {
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

  /**
   * To handle delete frame event
   * and set active frame after delete
   */
  const handleDeleteFrame = id => {
    const oldIndex = framesInStore.value.findIndex(f => f.id === id);

    deleteFrame({ id });

    const newId =
      framesInStore.value[oldIndex]?.id ??
      framesInStore.value[oldIndex - 1]?.id;

    setCurrentFrameId({ id: newId });
  };

  /**
   * To handle replace frame event
   * and set the active frame after replace
   */
  const handleReplaceFrame = ({ frame, frameId }) => {
    const newId = uniqueId();

    replaceFrame({ frame, frameId, newId });

    setCurrentFrameId({ id: newId });
  };

  /**
   * To handle add frame
   * and set the active frame after add
   */
  const handleAddFrame = frames => {
    addSupplementalFrame({ frames });

    const lastAddedFrame = framesInStore.value[framesInStore.value.length - 1];
    setCurrentFrameId({ id: lastAddedFrame.id });
  };

  return {
    handleChangeFrame,
    handleAddFrame,
    handleReplaceFrame,
    handleDeleteFrame
  };
};

export const useFrameOrdering = () => {
  const { moveFrame } = useMutations({
    moveFrame: DIGITAL_MUTATES.MOVE_FRAME
  });

  return { moveFrame };
};
