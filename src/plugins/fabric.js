import { fabric } from 'fabric';
import { CORNER_SIZE } from '@/common/constants';

const BORDER_COLOR = {
  OUTER: '#ffffff',
  INNER: '#8C8C8C',
  NONE: 'transparent'
};

/**
 * Draws borders of an object's bounding box.
 * Requires public properties: width, height
 * Requires public options: padding, borderColor
 * @param {CanvasRenderingContext2D} ctx Context to draw on
 * @param {Object} styleOverride object to override the object style
 * @return {fabric.Object} thisArg
 * @chainable
 */
const drawBorders = function(ctx, styleOverride) {
  styleOverride = styleOverride || {};
  var wh = this._calculateCurrentDimensions(),
    strokeWidth = this.borderScaleFactor,
    width = wh.x + strokeWidth,
    height = wh.y + strokeWidth,
    hasControls =
      typeof styleOverride.hasControls !== 'undefined'
        ? styleOverride.hasControls
        : this.hasControls;

  ctx.save();

  const isTransparent =
    (styleOverride.borderColor || this.borderColor) === BORDER_COLOR.NONE;
  const outerStyle = isTransparent ? BORDER_COLOR.NONE : BORDER_COLOR.OUTER;
  const innerStyle = isTransparent ? BORDER_COLOR.NONE : BORDER_COLOR.INNER;

  ctx.strokeStyle = outerStyle;
  this._setLineDash(
    ctx,
    styleOverride.borderDashArray || this.borderDashArray,
    null
  );

  ctx.strokeRect(
    -width / 2 - strokeWidth,
    -height / 2 - strokeWidth,
    width + strokeWidth,
    height + strokeWidth
  );

  ctx.strokeStyle = innerStyle;
  ctx.strokeRect(
    -width / 2,
    -height / 2,
    width + strokeWidth,
    height + strokeWidth
  );

  if (!hasControls) {
    ctx.restore();
    return this;
  }

  this.forEachControl(function(control, key, fabricObject) {
    if (control.withConnection && control.getVisibility(fabricObject, key)) {
      ctx.beginPath();
      ctx.strokeStyle = outerStyle;
      ctx.moveTo(control.x * width, control.y * height);
      ctx.lineTo(
        control.x * width + control.offsetX,
        control.y * height + control.offsetY
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(control.x * width + strokeWidth, control.y * height);
      ctx.strokeStyle = innerStyle;
      ctx.lineTo(
        control.x * width + control.offsetX + strokeWidth,
        control.y * height + control.offsetY
      );
      ctx.stroke();
    }
  });
  ctx.restore();
  return this;
};

/**
 * Draws corners of an object's bounding box.
 * Requires public properties: width, height
 * Requires public options: cornerSize, padding
 * @param {CanvasRenderingContext2D} ctx Context to draw on
 * @param {Object} styleOverride object to override the object style
 * @return {fabric.Object} thisArg
 * @chainable
 */
const drawControls = function(ctx, styleOverride) {
  const rotationIcon = require('@/assets/icons/rotation.svg');
  styleOverride = styleOverride || {};
  ctx.save();
  ctx.setTransform(
    this.canvas.getRetinaScaling(),
    0,
    0,
    this.canvas.getRetinaScaling(),
    0,
    0
  );
  ctx.strokeStyle = ctx.fillStyle =
    styleOverride.cornerColor || this.cornerColor;
  if (!this.transparentCorners) {
    ctx.strokeStyle = styleOverride.cornerStrokeColor || this.cornerStrokeColor;
  }
  this._setLineDash(
    ctx,
    styleOverride.cornerDashArray || this.cornerDashArray,
    null
  );
  this.setCoords();
  this.forEachControl(function(control, key, fabricObject) {
    if (control.getVisibility(fabricObject, key)) {
      if (control.actionName === 'rotate') {
        control.cursorStyleHandler = () =>
          `url(${rotationIcon}) ${CORNER_SIZE} ${CORNER_SIZE}, auto`;
      }
      control.render(
        ctx,
        fabricObject.oCoords[key].x,
        fabricObject.oCoords[key].y,
        styleOverride,
        fabricObject
      );
    }
  });
  ctx.restore();
  return this;
};

/**
 * Override Fabric base Object Prototype for Print version
 * @param {fabric.Object} object - the object to be prototyped
 */
const commonFabricOverrides = object => {
  object.cornerColor = BORDER_COLOR.OUTER;
  object.borderColor = BORDER_COLOR.INNER;
  object.borderSize = 1;
  object.cornerSize = CORNER_SIZE;
  object.cornerStrokeColor = BORDER_COLOR.INNER;
  object.transparentCorners = false;
  object.borderScaleFactor = 1;
};

/**
 * Override Fabric base Object Prototype for Print version
 * @param {fabric.Object} object - the object to be prototyped
 */
export const usePrintOverrides = object => {
  const objectPrototype = object || fabric.Object.prototype;
  commonFabricOverrides(objectPrototype);
  objectPrototype.drawBorders = drawBorders;
  objectPrototype.drawControls = drawControls;
};

/**
 * Override Fabric base Object Prototype for Digital version
 * @param {fabric.Object} object - the object to be prototyped
 */
export const useDigitalOverrides = object => {
  const objectPrototype = object || fabric.Object.prototype;
  commonFabricOverrides(objectPrototype);
  objectPrototype.setControlsVisibility({
    mtr: false
  });
};
