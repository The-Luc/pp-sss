import { DEFAULT_IMAGE, OBJECT_TYPE } from '@/common/constants';
import { BaseMoveableElementObject } from './base';
import { ImageCrop } from './image';

export class VideoElementObject extends BaseMoveableElementObject {
  type = OBJECT_TYPE.VIDEO;
  styleId = DEFAULT_IMAGE.STYLE_ID;
  imageId = null;
  imageUrl = '';
  hasImage = false;
  centerCrop = new ImageCrop();
  strokeUniform = DEFAULT_IMAGE.STROKE_UNIFORM;
  paintFirst = DEFAULT_IMAGE.PAINT_FIRST;
  isConstrain = true;
  thumbnailUrl = '';

  /**
   * @param {VideoElementObject} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
