import {
  DEFAULT_BORDER,
  DEFAULT_PROP,
  DEFAULT_SHADOW
} from '@/common/constants';
import { BaseEntity, BaseObject } from '../../base';

export class BaseSize extends BaseObject {
  width = 0;
  height = 0;

  /**
   * @param {BaseSize} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class BasePosition extends BaseObject {
  x = 0;
  y = 0;
  rotation = 0;

  /**
   * @param {BasePosition} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class BaseBorder extends BaseObject {
  showBorder = DEFAULT_BORDER.SHOW_BORDER;
  stroke = DEFAULT_BORDER.STROKE;
  strokeWidth = DEFAULT_BORDER.STROKE_WIDTH;
  strokeDashArray = DEFAULT_BORDER.STROKE_DASH_ARRAY;
  strokeLineType = DEFAULT_BORDER.STROKE_LINE_TYPE;

  /**
   * @param {BaseBorder} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class BaseShadow extends BaseObject {
  dropShadow = DEFAULT_SHADOW.DROP_SHADOW;
  shadowBlur = DEFAULT_SHADOW.BLUR;
  shadowOffset = DEFAULT_SHADOW.OFFSET;
  shadowOpacity = DEFAULT_SHADOW.OPACITY;
  shadowAngle = DEFAULT_SHADOW.ANGLE;
  shadowColor = DEFAULT_SHADOW.COLOR;

  /**
   * @param {BaseShadow} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class BaseFlip extends BaseObject {
  horizontal = false;
  vertical = false;

  /**
   * @param {BaseFlip} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class BaseElementEntity extends BaseEntity {
  sheetId = '';
  frameId = '';
  type = '';
  size = new BaseSize();
  coord = new BasePosition();
  opacity = DEFAULT_PROP.OPACITY;
  border = new BaseBorder();
  shadow = new BaseShadow();
  flip = new BaseFlip();
  zIndex = 0;

  /**
   * @param {BaseElementEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
