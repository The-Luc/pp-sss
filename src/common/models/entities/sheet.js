import { BaseEntity, BaseObject } from '../base';
import { SHEET_TYPE, POSITION_FIXED } from '@/common/constants';

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

export class SheetEditionData extends BaseObject {
  thumbnailUrl = null;
  isVisited = false;
  media = []; // media are store separately for print & digital. Mapping is handled by API.
  mappings = [];

  /**
   * @param {SheetEditionData} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SheetPrintData extends SheetEditionData {
  printLayoutId = null;
  link = '';
  spreadInfo = new SpreadInfo();
  objects = []; // on Print, objects is stored in sheet.printData.objects

  /**
   * @param {SheetPrintData} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SheetDigitalData extends SheetEditionData {
  digitalLayoutId = null;
  frames = []; // on Digital, objects is stored in sheet.digitalData.frames[n].objects
  transitions = [];
  /**
   * @param {SheetDigitalData} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SheetEntity extends BaseEntity {
  positionFixed = POSITION_FIXED.NONE;
  draggable = true;
  type = SHEET_TYPE.NORMAL;
  sectionId = '';
  layoutId = '';
  title = '';
  printData = new SheetPrintData();
  digitalData = new SheetDigitalData();

  /**
   * @param {SheetEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
