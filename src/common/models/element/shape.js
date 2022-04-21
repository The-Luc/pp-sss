import { DEFAULT_PROP, DEFAULT_SHAPE, OBJECT_TYPE } from '@/common/constants';
import { BaseMoveableElementObject, BaseSize } from './base';

export class ShapeElementObject extends BaseMoveableElementObject {
  type = OBJECT_TYPE.SHAPE;
  size = new BaseSize({
    width: DEFAULT_SHAPE.WIDTH,
    height: DEFAULT_SHAPE.HEIGHT
  });
  pathData = '';
  color = DEFAULT_PROP.COLOR;
  stroke = DEFAULT_PROP.COLOR;
  isConstrain = true;

  /**
   * @param {ShapeElementObject} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
