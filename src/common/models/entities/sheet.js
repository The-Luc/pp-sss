import { BaseObject } from '../base';
import { BaseElementEntity } from './elements';
import { SHEET_TYPE } from '@/common/constants';

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

export class SheetEditionData extends BaseObject {
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
  objects = [];

  /**
   * @param {SheetPrintData} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SheetDigitalData extends SheetEditionData {
  frames = [];
  /**
   * @param {SheetDigitalData} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SheetEntity extends BaseElementEntity {
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
