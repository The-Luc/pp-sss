import { useMutations, useGetters, useActions } from 'vuex-composition-helpers';
// TODO: delete if dont use
import {
  GETTERS as DIGITAL_GETTERS,
  ACTIONS as DIGITAL_ACTIONS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';
import { MUTATES } from '@/store/modules/app/const';
import { DIGI_RIGHT_TOOLS } from '@/common/constants';

/**
 * Handle toggle Frame Information
 */
export const useFrame = () => {
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

  const handleChangeFrame = () => {
    const layout = currentFrame.value;

    // update to store
    updateLayoutObjToStore({ layout });

    //open frame information panel
    if (!layout.isVisited) {
      setPropertiesObjectType({ type: DIGI_RIGHT_TOOLS.FRAME_INFO });
      setIsOpenProperties({ isOpen: true });
      setCurrentFrameVisited({ value: true });
    } else {
      setPropertiesObjectType({ type: '' });
      setIsOpenProperties({ isOpen: false });
    }
  };
  return { handleChangeFrame };
};
