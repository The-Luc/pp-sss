import { BaseMoveableElementObject } from './base';
import { ImageCrop } from './image';

import { DEFAULT_IMAGE, DEFAULT_VIDEO, OBJECT_TYPE } from '@/common/constants';

export class VideoElementObject extends BaseMoveableElementObject {
  type = OBJECT_TYPE.VIDEO;
  styleId = DEFAULT_IMAGE.STYLE_ID;
  imageId = null;
  imageUrl = '';
  hasImage = false;
  strokeUniform = DEFAULT_IMAGE.STROKE_UNIFORM;
  paintFirst = DEFAULT_IMAGE.PAINT_FIRST;
  isConstrain = true;
  thumbnailUrl = '';
  customThumbnailUrl = '';
  volume = DEFAULT_VIDEO.VOLUME;

  /**
   * @param {VideoElementObject} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
