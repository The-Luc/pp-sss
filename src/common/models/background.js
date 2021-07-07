import { cloneDeep } from 'lodash';

export const Background = {
  left: {},
  right: {}
};

export const getNewBackground = () => {
  return cloneDeep(Background);
};
