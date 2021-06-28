import { SHEET_TYPE } from '@/common/constants';

export const isHalfSheet = ({ type }) => {
  return [SHEET_TYPE.FRONT_COVER, SHEET_TYPE.BACK_COVER].indexOf(type) >= 0;
};

export const isHalfLeft = ({ type }) => {
  return type === SHEET_TYPE.BACK_COVER;
};

export const isHalfRight = ({ type }) => {
  return type === SHEET_TYPE.FRONT_COVER;
};
