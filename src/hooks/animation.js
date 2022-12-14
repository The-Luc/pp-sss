import { useGetters, useMutations } from 'vuex-composition-helpers';
import { GETTERS, MUTATES } from '@/store/modules/digital/const';
import { updateAnimationApi } from '@/api/playback';

export const useAnimation = () => {
  const { triggerChange } = useGetters({
    triggerChange: GETTERS.TRIGGER_ANIMATION
  });

  const {
    playInOrder,
    playOutOrder,
    playInIds,
    playOutIds,
    framePlayInDuration,
    framePlayOutDuration
  } = useGetters({
    playInOrder: GETTERS.PLAY_IN_ORDER,
    playOutOrder: GETTERS.PLAY_OUT_ORDER,
    playInIds: GETTERS.PLAY_IN_IDS,
    playOutIds: GETTERS.PLAY_OUT_IDS,
    framePlayInDuration: GETTERS.GET_PLAY_IN_DURATION,
    framePlayOutDuration: GETTERS.GET_PLAY_OUT_DURATION
  });

  const {
    setPlayInOrder,
    setPlayOutOrder,
    updatePlayInIds,
    updatePlayOutIds,
    updateTriggerAnimation
  } = useMutations({
    setPlayInOrder: MUTATES.SET_PLAY_IN_ORDER,
    setPlayOutOrder: MUTATES.SET_PLAY_OUT_ORDER,
    updatePlayInIds: MUTATES.SET_PLAY_IN_IDS,
    updatePlayOutIds: MUTATES.SET_PLAY_OUT_IDS,
    updateTriggerAnimation: MUTATES.UPDATE_TRIGGER_ANIMATION
  });

  return {
    updateAnimation: updateAnimationApi,
    playInIds,
    playOutIds,
    playInOrder,
    playOutOrder,
    setPlayInOrder,
    setPlayOutOrder,
    updatePlayInIds,
    updatePlayOutIds,
    framePlayInDuration,
    framePlayOutDuration,
    triggerChange,
    updateTriggerAnimation
  };
};
