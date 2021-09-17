import { BaseObject } from './base';
import { BaseBorder, BaseShadow } from './element';
import { TextAlignment } from './element/text';

import {
  DEFAULT_COLOR,
  PORTRAIT_IMAGE_MASK,
  PORTRAIT_NAME_DISPLAY,
  PORTRAIT_NAME_POSITION,
  DEFAULT_PRINT_PORTRAIT,
  PORTRAIT_FLOW_OPTION_SINGLE,
  PORTRAIT_FLOW_OPTION_MULTI,
  PORTRAIT_TEACHER_PLACEMENT,
  PORTRAIT_SIZE,
  PORTRAIT_ASSISTANT_PLACEMENT,
  DEFAULT_VALUE_PAGE_TITLE,
  DEFAULT_MARGIN
} from '../constants';

export class MarginSettings extends BaseObject {
  top = DEFAULT_MARGIN.TOP;
  bottom = DEFAULT_MARGIN.BOTTOM;
  left = DEFAULT_MARGIN.LEFT;
  right = DEFAULT_MARGIN.RIGHT;

  /**
   * @param {MarginSettings} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class PortraitLayoutSettings extends BaseObject {
  rowCount = DEFAULT_PRINT_PORTRAIT.ROW_COUNT;
  colCount = DEFAULT_PRINT_PORTRAIT.COLUMN_COUNT;
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
  teacherPlacement = PORTRAIT_TEACHER_PLACEMENT.FIRST;
  teacherPortraitSize = PORTRAIT_SIZE.LARGE;
  assistantTeacherPlacement = PORTRAIT_ASSISTANT_PLACEMENT.AFTER_TEACHERS;
  assistantTeacherPortraitSize = PORTRAIT_SIZE.SAME;

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
  color = DEFAULT_COLOR.COLOR;
  isBold = false;
  isItalic = false;
  isUnderline = false;
  textCase = '';
  alignment = new TextAlignment();

  /**
   * @param {PortraitFontSettings} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class PortraitTextSettings extends BaseObject {
  pageTitle = DEFAULT_VALUE_PAGE_TITLE;
  isPageTitleOn = false;
  pageTitleFontSettings = new PortraitFontSettings();
  pageTitleMargins = new MarginSettings();
  nameTextFontSettings = new PortraitFontSettings();
  nameDisplay = PORTRAIT_NAME_DISPLAY.FIRST_LAST; // FIRST_LAST, LAST_FIRST
  namePosition = PORTRAIT_NAME_POSITION.CENTERED; // CENTERED, OUTSIDE
  nameLines = 1;
  nameWidth = 1.5;
  nameGap = 0.125;

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
  mask = PORTRAIT_IMAGE_MASK.NONE; // NONE, ROUNDED_CORNERS, OVAL, CIRCLE, SQUARE

  /**
   * @param {PortraitImageSettings} props
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
  flowSingleSettings = new PortraitFlowSettings({
    flowOption: PORTRAIT_FLOW_OPTION_SINGLE.AUTO.id
  });
  flowMultiSettings = new PortraitFlowSettings({
    flowOption: PORTRAIT_FLOW_OPTION_MULTI.AUTO.id
  });
  savedDate = '';

  /**
   * @param {PortraitFlowData} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
