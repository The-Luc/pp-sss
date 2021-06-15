import { fabric } from 'fabric';
import { CORNER_SIZE } from '@/common/constants';

const BORDER_COLOR = {
  OUTER: '#ffffff',
  INNER: '#8C8C8C'
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
  ctx.strokeStyle = BORDER_COLOR.OUTER;
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

  ctx.strokeStyle = BORDER_COLOR.INNER;
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
      ctx.strokeStyle = BORDER_COLOR.OUTER;
      ctx.moveTo(control.x * width, control.y * height);
      ctx.lineTo(
        control.x * width + control.offsetX,
        control.y * height + control.offsetY
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(control.x * width + strokeWidth, control.y * height);
      ctx.strokeStyle = BORDER_COLOR.INNER;
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
 */
export const usePrintOverrides = () => {
  const fabricPrototype = fabric.Object.prototype;
  fabricPrototype.cornerColor = BORDER_COLOR.OUTER;
  fabricPrototype.borderColor = BORDER_COLOR.INNER;
  fabricPrototype.borderSize = 1.25;
  fabricPrototype.cornerSize = CORNER_SIZE;
  fabricPrototype.cornerStrokeColor = BORDER_COLOR.INNER;
  fabricPrototype.transparentCorners = false;
  fabricPrototype.borderScaleFactor = 1.5;
  fabricPrototype.prototype.drawBorders = drawBorders;
  fabricPrototype.prototype.drawControls = drawControls;
};

/**
 * Override Fabric base Object Prototype for Digital version
 */
export const useDigitalOverrides = () => {
  const fabricPrototype = fabric.Object.prototype;
  fabricPrototype.cornerColor = BORDER_COLOR.OUTER;
  fabricPrototype.borderColor = BORDER_COLOR.INNER;
  fabricPrototype.borderSize = 1.25;
  fabricPrototype.cornerSize = CORNER_SIZE;
  fabricPrototype.cornerStrokeColor = BORDER_COLOR.INNER;
  fabricPrototype.transparentCorners = false;
  fabricPrototype.borderScaleFactor = 1.5;

  fabricPrototype.setControlsVisibility({
    mtr: false
  });
};
