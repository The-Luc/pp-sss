import { DEFAULT_IMAGE, OBJECT_TYPE } from '@/common/constants';
import { BaseObject } from '../../base';
import { BaseElementEntity } from './base';

export class ImageCrop extends BaseObject {
  cropTop = 0;
  cropBottom = 0;
  cropLeft = 0;
  cropRight = 0;

  /**
   * @param {ImageCrop} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class ImageElementEntity extends BaseElementEntity {
  type = OBJECT_TYPE.IMAGE;
  styleId = DEFAULT_IMAGE.STYLE_ID;
  imageId = null;
  imageUrl = '';
  centerCrop = new ImageCrop();
  strokeUniform = DEFAULT_IMAGE.STROKE_UNIFORM;
  paintFirst = DEFAULT_IMAGE.PAINT_FIRST;
  isConstrain = true;

  /**
   * @param {ImageElementEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
