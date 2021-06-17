import { cloneDeep } from 'lodash';

export const PrintBackground = {
  left: {},
  right: {}
};

export const getNewPrintBackground = () => {
  return cloneDeep(PrintBackground);
};
