import { SHEET_TYPE } from '@/common/constants';

export const isHalfSheet = sheetType => {
  return (
    [SHEET_TYPE.FRONT_COVER, SHEET_TYPE.BACK_COVER].indexOf(sheetType) >= 0
  );
};

export const isHalfLeft = sheetType => {
  return sheetType === SHEET_TYPE.BACK_COVER;
};
