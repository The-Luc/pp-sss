import { ShapeElementEntity } from '../models/entities/elements';
import { SVG_FILL_MODE } from '@/common/constants/svgFillMode';

import LINE from '@/assets/image/shapes/line.svg';
import ARROW from '@/assets/image/shapes/arrow.svg';
import RECT from '@/assets/image/shapes/rect.svg';
import RECT_ROUNDED from '@/assets/image/shapes/rect-rounded.svg';
import CIRCLE from '@/assets/image/shapes/circle.svg';
import TRIANGLE from '@/assets/image/shapes/triangle.svg';
import STAR from '@/assets/image/shapes/star.svg';
import PENTAGON from '@/assets/image/shapes/pentagon.svg';
import HEXAGON from '@/assets/image/shapes/hexagon.svg';
import OCTAGON from '@/assets/image/shapes/octagon.svg';
import TRAPEZOID from '@/assets/image/shapes/trapezoid.svg';
import RHOMBUS from '@/assets/image/shapes/rhombus.svg';

export const SHAPES = [
  new ShapeElementEntity({
    id: 0,
    thumbnail: LINE,
    pathData: LINE,
    fillMode: SVG_FILL_MODE.STROKE
  }),
  new ShapeElementEntity({
    id: 1,
    thumbnail: ARROW,
    pathData: ARROW,
    fillMode: SVG_FILL_MODE.FILL
  }),
  new ShapeElementEntity({
    id: 2,
    thumbnail: RECT,
    pathData: RECT,
    fillMode: SVG_FILL_MODE.FILL
  }),
  new ShapeElementEntity({
    id: 3,
    thumbnail: RECT_ROUNDED,
    pathData: RECT_ROUNDED,
    fillMode: SVG_FILL_MODE.FILL
  }),
  new ShapeElementEntity({
    id: 4,
    thumbnail: CIRCLE,
    pathData: CIRCLE,
    fillMode: SVG_FILL_MODE.FILL
  }),
  new ShapeElementEntity({
    id: 5,
    thumbnail: TRIANGLE,
    pathData: TRIANGLE,
    fillMode: SVG_FILL_MODE.FILL
  }),
  new ShapeElementEntity({
    id: 6,
    thumbnail: STAR,
    pathData: STAR,
    fillMode: SVG_FILL_MODE.FILL
  }),
  new ShapeElementEntity({
    id: 7,
    thumbnail: PENTAGON,
    pathData: PENTAGON,
    fillMode: SVG_FILL_MODE.FILL
  }),
  new ShapeElementEntity({
    id: 8,
    thumbnail: HEXAGON,
    pathData: HEXAGON,
    fillMode: SVG_FILL_MODE.FILL
  }),
  new ShapeElementEntity({
    id: 9,
    thumbnail: OCTAGON,
    pathData: OCTAGON,
    fillMode: SVG_FILL_MODE.FILL
  }),
  new ShapeElementEntity({
    id: 10,
    thumbnail: TRAPEZOID,
    pathData: TRAPEZOID,
    fillMode: SVG_FILL_MODE.FILL
  }),
  new ShapeElementEntity({
    id: 11,
    thumbnail: RHOMBUS,
    pathData: RHOMBUS,
    fillMode: SVG_FILL_MODE.FILL
  })
];
