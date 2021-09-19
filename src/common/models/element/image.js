import {
  DEFAULT_IMAGE,
  OBJECT_TYPE,
  PORTRAIT_IMAGE_MASK
} from '@/common/constants';
import { BaseObject } from '../base';
import { BaseMoveableElementObject } from './base';

export class ImageCrop extends BaseObject {
  cropTop = 0;
  cropBottom = 0;
  cropLeft = 0;
  cropRight = 0;
  scale = 1;
  rotate = 0;
  translate = {
    left: 0,
    top: 0
  };

  /**
   * @param {ImageCrop} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class ImageElementObject extends BaseMoveableElementObject {
  type = OBJECT_TYPE.IMAGE;
  styleId = DEFAULT_IMAGE.STYLE_ID;
  imageId = null;
  imageUrl = '';
  originalUrl = '';
  hasImage = false;
  fromPortrait = false;
  cropInfo = new ImageCrop();
  strokeUniform = DEFAULT_IMAGE.STROKE_UNIFORM;
  paintFirst = DEFAULT_IMAGE.PAINT_FIRST;
  isConstrain = true;
  zoomLevel = 0;
  showControl = false;
  mask = PORTRAIT_IMAGE_MASK.NONE;

  /**
   * @param {ImageElementObject} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
