import { useGetters, useMutations } from 'vuex-composition-helpers';

import { GETTERS, MUTATES } from '@/store/modules/app/const';

export const useEyeDropper = () => {
  const { eyeDropper } = useGetters({
    eyeDropper: GETTERS.EYE_DROPPER
  });

  const { toggleEyeDropper } = useMutations({
    toggleEyeDropper: MUTATES.TOGGLE_EYE_DROPPER
  });

  return {
    eyeDropper,
    toggleEyeDropper
  };
};
