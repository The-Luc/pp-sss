import { DEFAULT_COLOR } from './defaultProperty';
export const PAGE_NUMBER_POSITION = {
  BOTTOM_CENTER: 'BOTTOM_CENTER',
  BOTTOM_OUTSIDE_CORNERS: 'BOTTOM_OUTSIDE_CORNERS'
};

export const PAGE_NUMBER_POSITION_OPTIONS = [
  { name: 'Bottom Center', value: PAGE_NUMBER_POSITION.BOTTOM_CENTER },
  {
    name: 'Bottom Outside Corners',
    value: PAGE_NUMBER_POSITION.BOTTOM_OUTSIDE_CORNERS
  }
];

export const STATUS_PAGE_NUMBER_OPTIONS = [
  { name: 'Off', value: false },
  { name: 'On', value: true }
];

export const BOTTOM_CENTER_VALUE = {
  TOP: 10.8,
  LEFT: 4.3
};

export const BOTTOM_OUTSIDE_CORNERS_VALUE = {
  TOP: 10.8,
  LEFT: 0.4
};

export const PAGE_NUMBER_TYPE = {
  LEFT_PAGE_NUMBER: 'LeftPageNumber',
  RIGHT_PAGE_NUMBER: 'RightPageNumber'
};

export const PAGE_INFO_DEFAULT = {
  isNumberingOn: false,
  position: PAGE_NUMBER_POSITION.BOTTOM_CENTER,
  fontFamily: 'Arial',
  fontSize: 8,
  color: DEFAULT_COLOR.COLOR
};
