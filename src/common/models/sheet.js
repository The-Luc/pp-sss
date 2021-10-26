import { BaseObject, BaseEntity } from './base';

import {
  POSITION_FIXED,
  SHEET_TYPE,
  DEFAULT_FRAME_DELAY
} from '@/common/constants';

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
  delay = DEFAULT_FRAME_DELAY;

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

export class SheetEditionDetail extends SheetBase {
  themeId = null;
  layoutId = null;
  link = '';
  isVisited = false;
  media = [];

  /**
   * @param {SheetEditionDetail} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SheetPrintDetail extends SheetEditionDetail {
  pageLeftName = null;
  pageRightName = null;
  thumnailLeftUrl = null;
  thumnailRightUrl = null;
  spreadInfo = new SpreadInfo();

  /**
   * @param {SheetPrintDetail} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SheetDigitalDetail extends SheetEditionDetail {
  pageName = null;
  thumbnailUrl = null;

  /**
   * @param {SheetDigitalDetail} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SheetDetail extends SheetBase {
  draggable = true;
  positionFixed = POSITION_FIXED.NONE;

  /**
   * @param {SheetDetail} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
