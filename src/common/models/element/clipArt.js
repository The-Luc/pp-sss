import {
  DEFAULT_CLIP_ART,
  OBJECT_TYPE,
  SVG_FILL_MODE
} from '@/common/constants';
import { BaseMoveableElementObject, BaseSize } from './base';

export class ClipArtElementObject extends BaseMoveableElementObject {
  type = OBJECT_TYPE.CLIP_ART;
  size = new BaseSize({
    width: DEFAULT_CLIP_ART.WIDTH,
    height: DEFAULT_CLIP_ART.HEIGHT
  });
  category = '';
  vector = '';
  imageUrl = '';
  fillMode = SVG_FILL_MODE.FILL;
  isColorful = true;
  isConstrain = true;

  /**
   * @param {ClipArtElementObject} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
