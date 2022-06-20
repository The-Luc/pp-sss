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
  link = '';
  thumbnailUrl = null;
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
  thumbnailLeftUrl = null;
  thumbnailRightUrl = null;
  pageIds = [];
  spreadInfo = new SpreadInfo();
  printLayoutId = null;

  /**
   * @param {SheetPrintDetail} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SheetDigitalDetail extends SheetEditionDetail {
  digitalLayoutId = null;
  pageName = null;
  frameIds = [];

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
