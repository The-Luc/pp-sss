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

  /**
   * @param {SheetBase} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SheetEditionData extends SheetBase {
  themeId = null;
  layoutId = null;
  thumbnailUrl = null;
  link = '';
  isVisited = false;

  /**
   * @param {SheetEditionData} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SheetPrintData extends SheetEditionData {
  spreadInfo = new SpreadInfo();

  /**
   * @param {SheetPrintData} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SheetDigitalData extends SheetEditionData {
  frameInfo = new FrameInfo();

  /**
   * @param {SheetDigitalData} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class Sheet extends SheetBase {
  draggable = true;
  positionFixed = POSITION_FIXED.NONE;

  /**
   * @param {Sheet} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
