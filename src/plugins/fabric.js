import { fabric } from 'fabric';
import { CORNER_SIZE, BORDER_STYLES, DEFAULT_TEXT } from '@/common/constants';
import { getRectDashes, ptToPx } from '@/common/utils';

const BORDER_COLOR = {
  OUTER: '#ffffff',
  INNER: '#8C8C8C',
  NONE: 'transparent'
};

/**
 * Create stroke clipPath to make double stroke
 * @param {Number} width - rect's width
 * @param {Number} height - rect's height
 * @param {Number} strokeWidth - rect's strokeWidth
 * @returns {fabric.Group} clipPath object
 */
const getDoubleStrokeClipPath = function(
  width,
  height,
  strokeWidth,
  scaleX = 1,
  scaleY = 1
) {
  const origins = {
    originX: 'center',
    originY: 'center'
  };

  const XYRatio = scaleX / scaleY;

  const strokeOffsetX = (strokeWidth * 0.15) / scaleX;
  const strokeOffsetY = (strokeWidth * 0.15) / scaleY;

  const hozSize = {
    left: 0,
    width: width - strokeOffsetY * (1 / XYRatio),
    height: (strokeWidth * 0.2) / scaleY,
    ...origins
  };

  const verSize = {
    top: 0,
    width: (strokeWidth * 0.2) / scaleX,
    height: height - strokeOffsetX * XYRatio,
    ...origins
  };

  const rectTop = new fabric.Rect({
    top: height * -0.5 + strokeOffsetY,
    ...hozSize
  });

  const rectBottom = new fabric.Rect({
    top: height * 0.5 - strokeOffsetY,
    ...hozSize
  });

  const rectLeft = new fabric.Rect({
    left: width * -0.5 + strokeOffsetX,
    ...verSize
  });

  const rectRight = new fabric.Rect({
    left: width * 0.5 - strokeOffsetX,
    ...verSize
  });

  return new fabric.Group([rectTop, rectBottom, rectLeft, rectRight], {
    inverted: true
  });
};

/**
 *  Allow adding padding between image and stroke
 * @param {2D context Object} ctx the object enable to modify context canvas
 */
const renderFill = function(ctx) {
  const elementToDraw = this._element;
  if (!elementToDraw) {
    return;
  }
  const scaleX = this._filterScalingX,
    scaleY = this._filterScalingY,
    w = this.width,
    h = this.height,
    min = Math.min,
    max = Math.max,
    // crop values cannot be lesser than 0.
    cropX = max(this.cropX, 0),
    cropY = max(this.cropY, 0),
    elWidth = elementToDraw.naturalWidth || elementToDraw.width,
    elHeight = elementToDraw.naturalHeight || elementToDraw.height,
    sX = cropX * scaleX,
    sY = cropY * scaleY,
    // the width height cannot exceed element width/height, starting from the crop offset.
    sW = min(w * scaleX, elWidth - sX),
    sH = min(h * scaleY, elHeight - sY),
    maxDestW = min(w, elWidth / scaleX - cropX),
    maxDestH = min(h, elHeight / scaleY - cropY);

  const offsetX = this.strokeWidth / this.scaleX;

  const offsetY = this.strokeWidth / this.scaleY;

  // if scaleX >> scaleY -> y should increase, and vice versa
  const XYRatio = this.scaleX / this.scaleY;

  const x = -w / 2 + offsetX / 2;
  const y = -h / 2 + (offsetX / 2) * XYRatio;

  elementToDraw &&
    ctx.drawImage(
      elementToDraw,
      sX,
      sY,
      sW,
      sH,
      x,
      y,
      maxDestW - offsetX,
      maxDestH - offsetY
    );
};

/**
 * Image Render function with override on clipPath to support double stroke
 * @param {CanvasRenderingContext2D} ctx Context to render on
 */
const imageRender = function(ctx) {
  this.clipPath = null;
  this.strokeDashArray = [];

  if (!this.strokeWidth) {
    fabric.Image.prototype._render.call(this, ctx);
    return;
  }

  if (this.strokeLineType === BORDER_STYLES.DOUBLE) {
    this.clipPath = getDoubleStrokeClipPath(
      this.width,
      this.height,
      this.strokeWidth,
      this.scaleX,
      this.scaleY
    );
  }

  if (
    [BORDER_STYLES.ROUND, BORDER_STYLES.SQUARE].includes(this.strokeLineType)
  ) {
    const height = this.height * this.scaleY;
    const width = this.width * this.scaleX;

    this.strokeDashArray = getRectDashes(
      width,
      height,
      this.strokeLineType,
      this.strokeWidth
    );
  }

  fabric.Image.prototype._render.call(this, ctx);
};
/**
 * this function render a temporary canvas with the clipPath.
 * if not, won't do anything
 */
const renderClipPathCache = function() {
  const canvas = fabric.util.createCanvasElement();

  canvas.width = this._cacheCanvas.width;
  canvas.height = this._cacheCanvas.height;

  const ctx = canvas.getContext('2d');
  ctx.translate(this.cacheTranslationX, this.cacheTranslationY);
  ctx.scale(this.zoomX, this.zoomY);
  this.clipPath.transform(ctx);
  this.clipPath.drawObject(ctx, true);

  return canvas;
};

/**
 * Execute the drawing operation for an object clipPath
 * @param {CanvasRenderingContext2D} ctx Context to render on
 */
const drawClipPathOnCache = function(ctx, canvas) {
  const path = this.clipPath;
  ctx.save();

  if (path.inverted) {
    ctx.globalCompositeOperation = 'destination-out';
  } else {
    ctx.globalCompositeOperation = 'destination-in';
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (path.absolutePositioned) {
    const m = fabric.util.invertTransform(this.calcTransformMatrix());
    ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
  }

  ctx.drawImage(canvas, 0, 0);
  ctx.restore();
};

const drawClipPath = function(ctx) {
  const path = this.clipPath;
  if (!path) {
    return;
  }

  path.canvas = this.canvas;
  path.shouldCache();
  path._transformDone = true;
  const canvas = this.renderClipPathCache();
  this.drawClipPathOnCache(ctx, canvas);
};

/**
 * Rect Render function with override on clipPath to support double stroke
 * @param {CanvasRenderingContext2D} ctx Context to render on
 */
const rectRender = function(ctx) {
  this.clipPath = null;
  this.strokeDashArray = [];

  if (!this.strokeWidth) {
    fabric.Rect.prototype._render.call(this, ctx);
    return;
  }

  if (this.strokeLineType === BORDER_STYLES.DOUBLE) {
    this.clipPath = getDoubleStrokeClipPath(
      this.width,
      this.height,
      this.strokeWidth
    );
  }

  if (
    [BORDER_STYLES.ROUND, BORDER_STYLES.SQUARE].includes(this.strokeLineType)
  ) {
    this.strokeDashArray = getRectDashes(
      this.width,
      this.height,
      this.strokeLineType,
      this.strokeWidth
    );
  }

  fabric.Rect.prototype._render.call(this, ctx);
};

/**
 * Allow fabric rect object to have double stroke
 * @param {fabric.Rect} rect - the object to enable double stroke
 */
export const useDoubleStroke = function(rect) {
  rect._render = rectRender;
};

/**
 * Allow fabric image object to have double stroke
 * @param {fabric.Image} image - the object to enable double stroke
 */
export const imageBorderModifier = function(image) {
  image._render = imageRender;
  image._renderFill = renderFill;
  image._drawClipPath = drawClipPath;
  image.renderClipPathCache = renderClipPathCache;
  image.drawClipPathOnCache = drawClipPathOnCache;
};

/**
 * Text Render function with override on lineSpacing to support auto lineHeight adjust
 * @param {CanvasRenderingContext2D} ctx Context to render on
 */
const textRender = function(ctx) {
  if (!this.lineSpacing && this.lineHeight !== DEFAULT_TEXT.LINE_HEIGHT) {
    this.set({
      lineSpacing: 0,
      lineHeight: DEFAULT_TEXT.LINE_HEIGHT
    });
  }
  const lineHeight = ptToPx(this.lineSpacing) / this.fontSize;
  if (this.lineSpacing && this.lineHeight !== lineHeight) {
    this.set({ lineHeight });
  }
  fabric.Textbox.prototype.render.call(this, ctx);
};

/**
 * Allow fabric text object to have lineHeight override
 * @param {fabric.Textbox} text - the object to enable lineHeight override
 */
export const useTextOverride = function(text) {
  text.render = textRender;
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
  const wh = this._calculateCurrentDimensions(),
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
  objectPrototype.drawBorders = drawBorders;
  objectPrototype.drawControls = drawControls;
};
