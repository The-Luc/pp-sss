import { DEFAULT_PROP, DEFAULT_TEXT, OBJECT_TYPE } from '@/common/constants';
import { BaseObject } from '../base';
import { BaseMoveableElementObject } from './base';

export class TextAlignment extends BaseObject {
  horizontal = DEFAULT_TEXT.ALIGNMENT.HORIZONTAL; // LEFT, CENTER, RIGHT, JUSTIFY
  vertical = DEFAULT_TEXT.ALIGNMENT.VERTICAL; // TOP, MIDDLE, BOTTOM

  /**
   * @param {TextAlignment} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class TextElementObject extends BaseMoveableElementObject {
  idFromLayout = null;
  type = OBJECT_TYPE.TEXT;
  color = DEFAULT_PROP.COLOR;
  styleId = DEFAULT_TEXT.STYLE_ID;
  text = DEFAULT_TEXT.TEXT;
  fontFamily = DEFAULT_TEXT.FONT_FAMILY;
  fontSize = DEFAULT_TEXT.FONT_SIZE;
  isBold = false;
  isItalic = false;
  isUnderline = false;
  textCase = DEFAULT_TEXT.TEXT_CASE; // UPPERCASE || LOWERCASE || CAPITALIZE
  alignment = new TextAlignment();
  letterSpacing = DEFAULT_TEXT.LETTER_SPACING;
  lineSpacing = DEFAULT_TEXT.LINE_SPACING; // 1.2 * em
  lineHeight = DEFAULT_TEXT.LINE_HEIGHT;
  column = DEFAULT_TEXT.COLUMN;
  isConstrain = false;

  /**
   * @param {TextElementObject} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
