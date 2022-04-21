import {
  DEFAULT_CLIP_ART,
  DEFAULT_PROP,
  OBJECT_TYPE,
  SVG_FILL_MODE
} from '@/common/constants';
import { BaseElementEntity, BaseSize } from './base';

export class ClipArtElementEntity extends BaseElementEntity {
  type = OBJECT_TYPE.CLIP_ART;
  size = new BaseSize({
    width: DEFAULT_CLIP_ART.WIDTH,
    height: DEFAULT_CLIP_ART.HEIGHT
  });
  category = '';
  name = '';
  thumbnail = '';
  vector = '';
  color = DEFAULT_PROP.COLOR;
  fillMode = SVG_FILL_MODE.FILL;
  isColorful = false;
  isConstrain = true;

  /**
   * @param {ClipArtElementEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
