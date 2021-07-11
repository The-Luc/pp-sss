import { useMutations, useGetters, useActions } from 'vuex-composition-helpers';
// TODO: delete if dont use
import {
  GETTERS as DIGITAL_GETTERS,
  ACTIONS as DIGITAL_ACTIONS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';
import { MUTATES } from '@/store/modules/app/const';
import { DIGITAL_RIGHT_TOOLS } from '@/common/constants';

/**
 * Handle toggle Frame Information
 */
export const useFrame = () => {
  const { currentFrame, nextFrameIdAfterDelete } = useGetters({
    currentFrame: DIGITAL_GETTERS.CURRENT_FRAME,
    nextFrameIdAfterDelete: DIGITAL_GETTERS.NEXT_FRAME_ID_AFTER_DELETE
  });

  const {
    setPropertiesObjectType,
    setIsOpenProperties,
    setCurrentFrameVisited,
    addSupplementalFrame,
    deleteFrame,
    setCurrentFrameId
  } = useMutations({
    setPropertiesObjectType: MUTATES.SET_PROPERTIES_OBJECT_TYPE,
    setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES,
    setCurrentFrameVisited: DIGITAL_MUTATES.SET_CURRENT_FRAME_VISITED,
    addSupplementalFrame: DIGITAL_MUTATES.ADD_SUPPLEMENTAL_FRAMES,
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
    const newId = nextFrameIdAfterDelete.value(id);
    deleteFrame({ id });

    setCurrentFrameId({ id: newId });
  };

  return { handleChangeFrame, addSupplementalFrame, handleDeleteFrame };
};
