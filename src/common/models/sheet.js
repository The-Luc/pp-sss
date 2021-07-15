import { BaseObject } from './base';
import { DefaultLayout } from './layout';

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

export class SheetEditionData extends BaseObject {
  themeId = null;
  layout = new DefaultLayout();
  thumbnailUrl = null;
  link = '';

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

export class Sheet extends BaseObject {
  id = null;
  type = 0;
  draggable = false;
  isVisited = false;
  positionFixed = '';
  printData = new SheetPrintData();
  digitalData = new SheetDigitalData();

  /**
   * @param {Sheet} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
