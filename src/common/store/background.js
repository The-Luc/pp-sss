import { isEmpty } from '../utils';

export const setBackgrounds = (state, { backgrounds }) => {
  state.background = backgrounds;
};

export const getDigitalBackground = ({ background }) => {
  return isEmpty(background.left.backgroundType) ? {} : background.left;
};
