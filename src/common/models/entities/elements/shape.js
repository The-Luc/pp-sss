import { DEFAULT_PROP, DEFAULT_SHAPE, OBJECT_TYPE } from '@/common/constants';
import { BaseElementEntity, BaseSize } from './base';

export class ShapeElementEntity extends BaseElementEntity {
  type = OBJECT_TYPE.SHAPE;
  size = new BaseSize({
    width: DEFAULT_SHAPE.WIDTH,
    height: DEFAULT_SHAPE.HEIGHT
  });
  name = '';
  thumbnail = '';
  pathData = '';
  color = DEFAULT_PROP.COLOR;
  stroke = DEFAULT_PROP.COLOR;
  isConstrain = true;

  /**
   * @param {ShapeElementEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
