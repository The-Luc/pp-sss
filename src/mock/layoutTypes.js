import { LAYOUT_TYPES } from '@/common/constants/layoutTypes';

const getLayoutTypesOptions = () => {
  return Object.keys(LAYOUT_TYPES).map(key => ({
    name: LAYOUT_TYPES[key].name,
    value: LAYOUT_TYPES[key].value
  }));
};

export const LAYOUT_TYPES_OPTIONs = getLayoutTypesOptions();
