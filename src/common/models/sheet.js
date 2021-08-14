import { BaseObject, BaseEntity } from './base';

import { POSITION_FIXED, SHEET_TYPE } from '@/common/constants';

export class SpreadInfo extends BaseObject {
  leftTitle = '';
  rightTitle = '';
  isLeftNumberOn = false;
  isRightNumberOn = false;

  /**
   * @param {SpreadInfo} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class FrameInfo extends BaseObject {
  title = '';
  delay = 0;

  /**
   * @param {FrameInfo} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SheetBase extends BaseEntity {
  type = SHEET_TYPE.NORMAL;
  sectionId = null;

  /**
   * @param {SheetBase} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SheetEditionInfo extends SheetBase {
  themeId = null;
  layoutId = null;
  thumbnailUrl = null;
  link = '';
  isVisited = false;
  media = [];

  /**
   * @param {SheetEditionInfo} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SheetPrintInfo extends SheetEditionInfo {
  pageLeftName = null;
  pageRightName = null;
  spreadInfo = new SpreadInfo();

  /**
   * @param {SheetPrintInfo} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SheetDigitalInfo extends SheetEditionInfo {
  pageName = null;
  frames = [];

  /**
   * @param {SheetDigitalInfo} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SheetInfo extends SheetBase {
  draggable = true;
  positionFixed = POSITION_FIXED.NONE;

  /**
   * @param {SheetInfo} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
