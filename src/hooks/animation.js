import { useGetters, useMutations } from 'vuex-composition-helpers';
import { GETTERS, MUTATES } from '@/store/modules/digital/const';

export const useAnimation = () => {
  const { setStoreAnimationProp } = useMutations({
    setStoreAnimationProp: MUTATES.SET_STORE_ANIMATION_PROP
  });

  const { storeAnimationProp } = useGetters({
    storeAnimationProp: GETTERS.STORE_ANIMATION_PROP
  });

  const { playInOrder, playOutOrder, playInIds, playOutIds } = useGetters({
    playInOrder: GETTERS.PLAY_IN_ORDER,
    playOutOrder: GETTERS.PLAY_OUT_ORDER,
    playInIds: GETTERS.PLAY_IN_IDS,
    playOutIds: GETTERS.PLAY_OUT_IDS
  });

  const {
    setPlayInOrder,
    setPlayOutOrder,
    updatePlayInIds,
    updatePlayOutIds
  } = useMutations({
    setPlayInOrder: MUTATES.SET_PLAY_IN_ORDER,
    setPlayOutOrder: MUTATES.SET_PLAY_OUT_ORDER,
    updatePlayInIds: MUTATES.SET_PLAY_IN_IDS,
    updatePlayOutIds: MUTATES.SET_PLAY_OUT_IDS
  });

  return {
    storeAnimationProp,
    setStoreAnimationProp,
    playInIds,
    playOutIds,
    playInOrder,
    playOutOrder,
    setPlayInOrder,
    setPlayOutOrder,
    updatePlayInIds,
    updatePlayOutIds
  };
};
