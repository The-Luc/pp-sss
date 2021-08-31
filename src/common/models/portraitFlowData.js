import { DEFAULT_COLOR } from '../constants';
import { BaseObject } from './base';
import { BaseBorder, BaseShadow } from './element';

export class MarginSettings extends BaseObject {
  top = 0;
  bottom = 0;
  left = 0;
  right = 0;

  /**
   * @param {MarginSettings} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class PortraitLayoutSettings extends BaseObject {
  rowCount = 0;
  colCount = 0;
  margins = new MarginSettings();

  /**
   * @param {PortraitLayoutSettings} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class PortraitTeacherSettings extends BaseObject {
  hasTeacher = false;
  hasAssistantTeacher = false;
  teacherPlacement = '';
  teacherPortraitSize = '';
  assistantTeacherPlacement = '';
  assistantTeacherPortraitSize = '';

  /**
   * @param {PortraitTeacherSettings} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class PortraitFontSettings extends BaseObject {
  fontFamily = '';
  fontSize = 0;
  fontColor = DEFAULT_COLOR.COLOR;
  presentation = '';
  textCase = '';
  alignment = '';

  /**
   * @param {PortraitFontSettings} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class PortraitTextSettings extends BaseObject {
  pageTitle = '';
  isPageTitleOn = false;
  pageTitleFontSettings = new PortraitFontSettings();
  pageTitleMargins = new MarginSettings();
  nameTextFontSettings = new PortraitFontSettings();
  nameDisplay = ''; // FIRST_LAST, LAST_FIRST
  namePosition = ''; // CENTERED, OUTSIDE
  nameLines = '';
  nameWidth = 0;
  nameGap = '';

  /**
   * @param {PortraitTextSettings} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class PortraitImageSettings extends BaseObject {
  border = new BaseBorder();
  shadow = new BaseShadow();
  mask = ''; // NONE, ROUNDED_CORNERS, OVAL, CIRCLE, SQUARE

  /**
   * @param {PortraitTextSettings} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class PortraitFlowSettings extends BaseObject {
  flowOption = ''; // AUTO, CONTINUE (for multi folders), MANUAL
  pages = []; // [2, 3, 4]

  /**
   * @param {PortraitFlowSettings} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class PortraitFlowData extends BaseObject {
  name = '';
  folders = [];
  totalPortraitsCount = 0;
  startOnPageNumber = 1;
  layoutSettings = new PortraitLayoutSettings();
  teacherSettings = new PortraitTeacherSettings();
  textSettings = new PortraitTextSettings();
  imageSettings = new PortraitImageSettings();
  flowSingleSettings = new PortraitFlowSettings();
  flowMultiSettings = new PortraitFlowSettings();
  savedDate = '';

  /**
   * @param {PortraitFlowData} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
