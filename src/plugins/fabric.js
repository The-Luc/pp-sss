import { fabric } from 'fabric';
import {
  CORNER_SIZE,
  BORDER_STYLES,
  DEFAULT_TEXT,
  OBJECT_TYPE,
  VIDEO_MSPF,
  PORTRAIT_IMAGE_MASK,
  OVERLAY_BACKGROUND_COLOR,
  IMAGE_LOCAL
} from '@/common/constants';
import { createMediaOverlay } from '@/common/fabricObjects';

import {
  getRectDashes,
  getRectDashesForPortrait,
  inToPx,
  isEmpty,
  ptToPx,
  videoEndRewindEvent,
  videoRewindEvent,
  videoSeekEvent,
  videoToggleStatusEvent,
  isFbTextObject,
  getDistance
} from '@/common/utils';
import {
  handleRenderOverlayImage,
  handleRenderOverlayText
} from './fabricMapping';

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
const renderFillImage = function(ctx) {
  const elementToDraw = this._element;
  if (!this.zoomLevel) this.zoomLevel = 0;
  const zoomLevel = 1 + this.zoomLevel;

  const min = Math.min;
  const max = Math.max;

  const w = this.width;
  const h = this.height;

  // crop values cannot be lesser than 0.
  const cropX = max(this.cropX, 0);
  const cropY = max(this.cropY, 0);

  const scaleX = this._filterScalingX;
  const scaleY = this._filterScalingY;

  const elWidth = elementToDraw.naturalWidth || elementToDraw.width;
  const elHeight = elementToDraw.naturalHeight || elementToDraw.height;

  const offsetX = this.strokeWidth / this.scaleX;
  const offsetY = this.strokeWidth / this.scaleY;
  const XYRatio = this.scaleX / this.scaleY; // if scaleX >> scaleY -> y should increase, and vice versa

  const fWidth = (w * this.scaleX) / zoomLevel;
  const fHeight = (h * this.scaleY) / zoomLevel;
  const diffWidth = (elWidth - fWidth) / 2;
  const diffHeight = (elHeight - fHeight) / 2;

  const sX = this.hasImage && !this.fromPortrait ? diffWidth : cropX * scaleX;
  const sY = this.hasImage && !this.fromPortrait ? diffHeight : cropY * scaleY;
  const sW =
    this.hasImage && !this.fromPortrait
      ? (w * this.scaleX) / zoomLevel
      : min(w * scaleX, elWidth - sX); // the width height cannot exceed element width/height, starting from the crop offset.
  const sH =
    this.hasImage && !this.fromPortrait
      ? (h * this.scaleY) / zoomLevel
      : min(h * scaleY, elHeight - sY);

  const dX = -w / 2 + offsetX / 2;
  const dY = -h / 2 + (offsetX / 2) * XYRatio;
  const dW = min(w, elWidth / scaleX - cropX) - offsetX;
  const dH = min(h, elHeight / scaleY - cropY) - offsetY;
  if (this.fromPortrait && this.mask === PORTRAIT_IMAGE_MASK.SQUARE) {
    return ctx.drawImage(
      elementToDraw,
      sX,
      sY + (sH - sW) / 2,
      sW,
      sW,
      dX,
      dY,
      dW,
      dH
    );
  }

  ctx.drawImage(elementToDraw, sX, sY, sW, sH, dX, dY, dW, dH);
};

/**
 * Handle render thumbnail for video object
 * @param {2D context Object} ctx the object enable to modify context canvas
 */
const renderVideoThumbnail = function(ctx) {
  const elementToDraw = this.thumbnail;

  const elWidth = elementToDraw.naturalWidth || elementToDraw.width;
  const elHeight = elementToDraw.naturalHeight || elementToDraw.height;

  const xZoom = (this.width * this.scaleX - elWidth) / elWidth;
  const yZoom = (this.height * this.scaleY - elHeight) / elHeight;
  const zoomLevel = Math.max(xZoom, yZoom) + 1;

  const offsetX = this.strokeWidth / this.scaleX;
  const offsetY = this.strokeWidth / this.scaleY;

  const sW = (this.width * this.scaleX) / zoomLevel;
  const sH = (this.height * this.scaleY) / zoomLevel;
  const sX = (elWidth - sW) / 2;
  const sY = (elHeight - sH) / 2;

  const dX = -this.width / 2 + offsetX / 2;
  const dY = -this.height / 2 + offsetY / 2;
  const dW = this.width - offsetX;
  const dH = this.height - offsetY;

  ctx.drawImage(this.thumbnail, sX, sY, sW, sH, dX, dY, dW, dH);
};

/**
 * Handle render thumbnail for video object
 * @param {Object} target the fabric object enable to modify
 */
export const renderImageCropControl = function(target) {
  if (!target.hasImage || !target.selectable) return;

  const { width, height, canvas, control, scaleX, scaleY, angle } = target;
  if (!control) return;

  const zoom = canvas.getZoom();
  const ctx = canvas.getContext('2d');

  const rad = (Math.PI * (angle % 360)) / 180;

  const eleWidth = width * scaleX * zoom;
  const eleHeight = height * scaleY * zoom;

  const isHidden =
    eleWidth < inToPx(1) * zoom || eleHeight < (inToPx(0.5) + 10) * zoom;

  const iconWidth = isHidden ? 0 : inToPx(1) * zoom;
  const iconHeight = iconWidth / 2;

  const { x, y } = target.getCenterPoint();

  const offsetY = (eleHeight - iconHeight) / 2 - 10;

  const centerX = x * zoom;
  const centerY = y * zoom;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rad);
  ctx.translate(0, offsetY);
  ctx.drawImage(
    control,
    -iconWidth / 2,
    -iconHeight / 2,
    iconWidth,
    iconHeight
  );
  ctx.restore();
};

/**
 * Handle render play icon for video object
 * @param {2D context Object} ctx the object enable to modify context canvas
 */
const renderVideoPlayIcon = function(ctx) {
  const { width, height } = this.playIcon;

  const sW = (this.width * this.scaleX) / 2;
  const sH = (this.height * this.scaleY) / 2;

  const sX = (width / 4 - sW) / 2;
  const sY = (height / 4 - sH) / 2;

  const dX = -this.width / 2;
  const dY = -this.height / 2;

  if (this.flipX) {
    ctx.scale(-1, 1);
  }

  if (this.flipY) {
    ctx.scale(1, -1);
  }

  ctx.shadowColor = 'transparent';
  ctx.drawImage(this.playIcon, sX, sY, sW, sH, dX, dY, this.width, this.height);
};

/**
 *  Allow adding padding between video and stroke
 * @param {2D context Object} ctx the object enable to modify context canvas
 */
const renderFillVideo = function(ctx) {
  const elementToDraw = this._element;

  const min = Math.min;
  const max = Math.max;

  const w = this.width;
  const h = this.height;

  const cropX = max(this.cropX, 0);
  const cropY = max(this.cropY, 0);

  const scaleX = this._filterScalingX;
  const scaleY = this._filterScalingY;

  const elWidth = elementToDraw.naturalWidth || elementToDraw.width;
  const elHeight = elementToDraw.naturalHeight || elementToDraw.height;

  const xZoom = (this.width * this.scaleX - elWidth) / elWidth;
  const yZoom = (this.height * this.scaleY - elHeight) / elHeight;
  const zoomLevel = Math.max(xZoom, yZoom) + 1;

  const offsetX = this.strokeWidth / this.scaleX;
  const offsetY = this.strokeWidth / this.scaleY;
  const XYRatio = this.scaleX / this.scaleY;

  const fWidth = (w * this.scaleX) / zoomLevel;
  const fHeight = (h * this.scaleY) / zoomLevel;
  const sX = (elWidth - fWidth) / 2;
  const sY = (elHeight - fHeight) / 2;

  const sW = (w * this.scaleX) / zoomLevel;
  const sH = (h * this.scaleY) / zoomLevel;

  const dX = -w / 2 + offsetX / 2;
  const dY = -h / 2 + (offsetX / 2) * XYRatio;
  const dW = min(w, elWidth / scaleX - cropX) - offsetX;
  const dH = min(h, elHeight / scaleY - cropY) - offsetY;

  ctx.drawImage(elementToDraw, sX, sY, sW, sH, dX, dY, dW, dH);
};

/**
 *  Allow adding padding between image/video and stroke
 * @param {2D context Object} ctx the object enable to modify context canvas
 */
const renderFill = function(ctx) {
  const elementToDraw = this._element;
  if (!elementToDraw) return;

  if (this.objectType === OBJECT_TYPE.IMAGE) {
    return renderFillImage.call(this, ctx);
  }

  if (this.showThumbnail) {
    renderVideoThumbnail.call(this, ctx);
  } else {
    renderFillVideo.call(this, ctx);
  }

  if (this.showPlayIcon) {
    renderVideoPlayIcon.call(this, ctx);
  }
};

/**
 *
 * Image Render function with override on clipPath to support double stroke
 * @param {CanvasRenderingContext2D} ctx Context to render on
 */
const handleRenderBorderImage = function(ctx) {
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
};

/**
 * Image Render function with override on clipPath to support double stroke
 * @param {CanvasRenderingContext2D} ctx Context to render on
 */
const imageRender = function(ctx) {
  handleRenderBorderImage.call(this, ctx);

  fabric.Image.prototype._render.call(this, ctx);

  // overlay should be rendered at last
  handleRenderOverlayImage.call(this, ctx);
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
  if (!path) return;

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
    return fabric.Rect.prototype._render.call(this, ctx);
  }

  if (this.strokeLineType === BORDER_STYLES.DOUBLE) {
    if (this.fromPortrait) return fabric.Rect.prototype._render.call(this, ctx);

    this.clipPath = getDoubleStrokeClipPath(
      this.width,
      this.height,
      this.strokeWidth
    );
  }

  if (
    [BORDER_STYLES.ROUND, BORDER_STYLES.SQUARE].includes(this.strokeLineType)
  ) {
    if (
      [
        PORTRAIT_IMAGE_MASK.OVAL,
        PORTRAIT_IMAGE_MASK.ROUNDED,
        PORTRAIT_IMAGE_MASK.CIRCLE
      ].includes(this.mask)
    ) {
      const width = this.width * this.scaleX;
      const height = this.height * this.scaleY;
      const radius = this.rx * this.scaleX;

      // get perimeter of rounded corner object
      const perimeter =
        2 * (width + height) - 8 * radius + 2 * radius * Math.PI;

      this.strokeDashArray = getRectDashesForPortrait(
        width,
        height,
        this.strokeLineType,
        this.strokeWidth,
        perimeter
      );
    } else {
      this.strokeDashArray = getRectDashes(
        this.width,
        this.height,
        this.strokeLineType,
        this.strokeWidth
      );
    }
  }

  fabric.Rect.prototype._render.call(this, ctx);
};

/**
 * Render rounded, oval and circle image
 * @param {CanvasRenderingContext2D} ctx Context to render on
 */
const maskRender = function(ctx) {
  if (!this.img) return;

  const x = (this.strokeWidth - this.width) / 2;
  const y = (this.strokeWidth - this.height) / 2;
  const w = this.width - this.strokeWidth;
  const h = this.height - this.strokeWidth;
  const d = Math.min(w, h);
  const r = this.mask === PORTRAIT_IMAGE_MASK.ROUNDED ? d / 10 : d / 2;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.clip();
  if (this.mask === PORTRAIT_IMAGE_MASK.CIRCLE) {
    ctx.drawImage(
      this.img,
      0,
      (this.img.height - this.img.width) / 2,
      this.img.width,
      this.img.width,
      x,
      y,
      w,
      h
    );
  } else {
    ctx.drawImage(this.img, x, y, w, h);
  }
  ctx.restore();
};

const rectRenderStroke = function(ctx) {
  if (!this.fromPortrait || this.strokeLineType !== BORDER_STYLES.DOUBLE) {
    return fabric.Rect.prototype._renderStroke.call(this, ctx);
  }

  ctx.save();
  ctx.strokeStyle = this.stroke;
  ctx.lineWidth = this.strokeWidth * 0.33;
  ctx.stroke();
  ctx.restore();

  const x = (this.strokeWidth * 0.66 - this.width) / 2;
  const y = (this.strokeWidth * 0.66 - this.height) / 2;
  const w = this.width - this.strokeWidth * 0.66;
  const h = this.height - this.strokeWidth * 0.66;
  const d = Math.min(w, h);
  const r = this.mask === PORTRAIT_IMAGE_MASK.ROUNDED ? d / 10 : d / 2;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = this.stroke;
  ctx.fill();
  ctx.restore();
};

/**
 * Allow fabric rect object to have double stroke
 * @param {fabric.Rect} rect - the object to enable double stroke
 */
export const useDoubleStroke = function(rect) {
  rect._render = function(ctx) {
    rectRender.call(this, ctx);
    maskRender.call(this, ctx);
  };
  rect._renderStroke = rectRenderStroke;
};

export const useDisplayOverlay = function(object) {
  object.render = function(ctx) {
    fabric.Group.prototype.render.call(this, ctx);

    // overlay should be rendered at last
    handleRenderOverlayText.call(this, ctx);
  };
};

const getTimeToSet = (checkTime, duration) => {
  if (checkTime < 0) return 0;

  if (checkTime > duration) return duration;

  return checkTime;
};

/**
 * Handle play video
 */
const play = function() {
  const video = this.getElement();

  if (!video || !video.play) return;

  video.playbackRate = 1;

  const playPromise = video.play.call(video);

  if (isEmpty(playPromise)) {
    playPromise.catch(() => {}); // prevent play & pause error
  }
};

/**
 * Handle pause video
 */
const pause = function() {
  const video = this.getElement();

  if (!video || !video.pause) return;

  video.pause.call(video);
};

/**
 * Handle seek to time of video
 */
const seek = function(seekTime) {
  const video = this.getElement();

  if (!video) return;

  const isStart = video.currentTime === 0;
  const isEnd = video.currentTime === video.duration;

  if (seekTime < 0 && isStart) return;

  if (seekTime > 0 && isEnd) return;

  const nextTime = video.currentTime + seekTime;

  video.currentTime = getTimeToSet(nextTime, video.duration);

  if (video.currentTime === video.duration) video.play();
  else video.dispatchEvent(videoSeekEvent);
};

/**
 * Turn on fast forward video
 */
const keepForward = (videoObject, video) => {
  if (video.currentTime >= video.duration) return;

  video.isTempPlaying = !videoObject.isPlaying;

  videoObject.play();

  video.playbackRate = 2;
};

/**
 * Turn off fast forward video
 */
const cancelForward = (videoObject, video) => {
  video.playbackRate = 1;

  if (video.isTempPlaying) {
    videoObject.pause();
  }

  video.isTempPlaying = false;
};

/**
 * Handle fast forward video
 */
const forward = function(isForward = true) {
  const video = this.getElement();

  if (!video) return;

  isForward ? keepForward(this, video) : cancelForward(this, video);
};

const stopReverse = (videoObject, video) => {
  if (!video.isKeepRewind) return;

  video.isKeepRewind = false;

  videoObject.pause();

  if (!video.isTempPlaying) video.isKeepRewind = true;

  video.dispatchEvent(videoEndRewindEvent);
};

const animateReverse = (videoObject, video) => {
  const interval = setInterval(() => {
    // stop playing in reverse
    if (!video.isKeepRewind || video.currentTime <= 0) {
      clearInterval(interval);

      stopReverse(videoObject, video);

      return;
    }

    // calculate elapsed time since last loop
    const now = Date.now();
    const elapsed = now - video.then;

    if (elapsed <= VIDEO_MSPF) return;

    // if enough time has elapsed, draw the next frame
    video.then = now - (elapsed % VIDEO_MSPF);

    if (video.currentTime > 0) {
      video.currentTime -= VIDEO_MSPF / 1000;

      return;
    }

    clearInterval(interval);

    // if we reach the beginning, stop playing in reverse.
    stopReverse(videoObject, video);
  }, VIDEO_MSPF);
};

/**
 * Turn on fast rewind video
 */
const keepRewind = (videoObject, video) => {
  if (video.currentTime <= 0) return;

  video.isKeepRewind = true;
  video.isTempPlaying = !videoObject.isPlaying;

  video.then = Date.now();

  animateReverse(videoObject, video);

  video.currentTime -= 0.01;

  videoObject.play();

  video.playbackRate = 0;

  video.dispatchEvent(videoRewindEvent);
};

/**
 * Turn off fast rewind video
 */
const cancelRewind = (videoObject, video) => {
  if (!video.isKeepRewind) return;

  video.playbackRate = 1;
  video.isKeepRewind = false;

  if (video.isTempPlaying) videoObject.pause();
  else {
    videoObject.play();

    videoObject.isPlaying = true;

    video.dispatchEvent(videoToggleStatusEvent);
  }

  video.isTempPlaying = false;
};

/**
 * Handle fast rewind video
 */
const rewind = function(isRewind = true) {
  const video = this.getElement();

  if (!video) return;

  isRewind ? keepRewind(this, video) : cancelRewind(this, video);
};

/**
 * Handle change volume of video
 */
const changeVolume = function(volume) {
  const video = this.getElement();

  if (!video) return;

  video.volume = volume;
};

/**
 * Handle dispose video
 */
const dispose = function() {
  const video = this.getElement();

  if (!video || !video.pause) return;

  video.pause();

  video.src = '';
  video.removeAttribute('src');

  this.setElement(null);
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
 * Init event for video (fabric image)
 *
 * @param {fabric.Image} video  the object to enable event
 */
export const videoInitEvent = function(video) {
  video.play = play;
  video.pause = pause;
  video.seek = seek;
  video.forward = forward;
  video.rewind = rewind;
  video.changeVolume = changeVolume;
  video.dispose = dispose;
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
 * Render order icon with rotation
 * @param {CanvasRenderingContext2D} ctx Context to render on
 * @param {Element} element order element
 * @param {Number} top canvas object position top
 * @param {Number} left canvas object position left
 * @param {Number} width element width
 * @param {Number} height element height
 * @param {Number} zoom canvas zoom value
 * @param {Number} angle object rotation value
 * @param {Number} radius icon distance
 * @param {Number} opacity icon opacity
 */
export const drawOrderbox = function({
  ctx,
  value,
  top,
  left,
  width,
  height,
  zoom,
  angle,
  radius,
  opacity,
  isPlayIn
}) {
  const centerX = (Math.cos(angle) * radius + left) * zoom;
  const centerY = (Math.sin(angle) * radius + top) * zoom;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);
  ctx.globalAlpha = opacity || 1;
  ctx.strokeStyle = 'black';
  ctx.lineWidth = zoom * 4;
  ctx.strokeRect(
    (-width / 2) * zoom,
    (-height / 2) * zoom,
    width * zoom,
    height * zoom
  );
  ctx.fillStyle = isPlayIn ? 'white' : 'lightgray';
  ctx.fillRect(
    (-width / 2) * zoom,
    (-height / 2) * zoom,
    width * zoom,
    height * zoom
  );
  ctx.fillStyle = 'black';
  ctx.font = '13px MuseoSans';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(value, 0, 0);
  ctx.restore();
};

/**
 * Apply animation play in/out icon
 * @param @param {CanvasRenderingContext2D} ctx Context to render on
 */
const renderControls = function(ctx, styleOverride) {
  fabric.Object.prototype._renderControls.call(this, ctx, styleOverride);

  const zoom = this.canvas.getZoom();
  const angle = (Math.PI * (this.angle % 360)) / 180;
  const eleWidth = 40;
  const eleHeight = 40;

  if (this.playIn) {
    const radius = this.width * this.scaleX - eleWidth * 2;
    drawOrderbox({
      ctx,
      value: this.playIn,
      top: this.top,
      left: this.left,
      width: eleWidth,
      height: eleHeight,
      zoom,
      angle,
      radius,
      isPlayIn: true
    });
  }

  if (this.playOut) {
    const radius = this.width * this.scaleX - eleWidth;

    drawOrderbox({
      ctx,
      value: this.playOut,
      top: this.top,
      left: this.left,
      width: eleWidth,
      height: eleHeight,
      zoom,
      angle,
      radius
    });
  }
};

/**
 * Allow fabric text object to have lineHeight override
 * @param {fabric.Group} fabricObject - the object will be applied override
 */
export const useObjectControlsOverride = function(fabricObject) {
  fabricObject._renderControls = renderControls;
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
    this.canvas?.getRetinaScaling(),
    0,
    0,
    this.canvas?.getRetinaScaling(),
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
 *  To apply pattern for object has transformed gradient
 *
 * @param {2D context Object} ctx the object enable to modify context canvas
 * @param {object} filler  filter that will be converted to pattern
 */
function applyPatternForTransformedGradient(ctx, filler) {
  const dims = this._limitCacheSize(this._getCacheCanvasDimensions());
  const pCanvas = fabric.util.createCanvasElement();
  const retinaScaling = this.canvas.getRetinaScaling();
  const width = dims.width / this.scaleX / retinaScaling;
  const height = dims.height / this.scaleY / retinaScaling;

  pCanvas.width = width;
  pCanvas.height = height;

  const pCtx = pCanvas.getContext('2d');

  pCtx.beginPath();
  pCtx.moveTo(0, 0);
  pCtx.lineTo(width, 0);
  pCtx.lineTo(width, height);
  pCtx.lineTo(0, height);
  pCtx.closePath();
  pCtx.translate(width / 2, height / 2);
  pCtx.scale(
    dims.zoomX / this.scaleX / retinaScaling,
    dims.zoomY / this.scaleY / retinaScaling
  );
  this._applyPatternGradientTransform(pCtx, filler);
  pCtx.fillStyle = filler.toLive(ctx);
  pCtx.fill();
  ctx.translate(
    -this.width / 2 - this.strokeWidth / 2,
    -this.height / 2 - this.strokeWidth / 2
  );
  ctx.scale(
    (retinaScaling * this.scaleX) / dims.zoomX,
    (retinaScaling * this.scaleY) / dims.zoomY
  );
  ctx.strokeStyle = pCtx.createPattern(pCanvas, 'no-repeat');
}

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
  object._applyPatternForTransformedGradient = applyPatternForTransformedGradient;
};

/**
 * Override Fabric base Object Prototype
 * @param {fabric.Object} object - the object to be prototyped
 */
export const useOverrides = object => {
  const objectPrototype = object || fabric.Object.prototype;
  commonFabricOverrides(objectPrototype);
  objectPrototype.drawBorders = drawBorders;
  objectPrototype.drawControls = drawControls;
};

/**
 *  Render a overlay on the object
 *
 * @param {Object} target fabric element
 */
export const renderObjectOverlay = (target, icon) => {
  const { canvas, showOverlay, angle } = target;
  const ctx = canvas.getContext('2d');

  if (showOverlay?.isDisplayed) return;

  const [tl, tr, br] = target.getCoords();

  const width = getDistance(tl, tr);
  const height = getDistance(tr, br);

  const top = tl.y;
  const left = tl.x;

  const centerX = left + width / 2;
  const centerY = top + height / 2;

  // box size
  const w = 41;
  const h = 20;
  const x = centerX - w / 2;
  const y = centerY - h / 2;
  const r = 5;
  const calcAngle = (Math.PI * (angle % 360)) / 180;

  ctx.save();
  if (angle) {
    ctx.translate(left, top);
    ctx.rotate(calcAngle);
    ctx.translate(-left, -top);
  }

  ctx.fillStyle = OVERLAY_BACKGROUND_COLOR;
  ctx.fillRect(left, top, width, height);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.clip();

  ctx.fillStyle = 'white';
  ctx.fillRect(centerX - w / 2, centerY - h / 2, w, h);

  const iconWidth = 35;
  const iconHeight = 14;

  ctx.drawImage(
    icon,
    centerX - iconWidth / 2,
    centerY - iconHeight / 2,
    iconWidth,
    iconHeight
  );

  ctx.restore();
};

/**
 *  Render a overlay on the object
 *
 * @param {Object} target fabric element
 */

export const renderMappingIcon = async target => {
  const { canvas, mappingInfo, angle } = target;
  const ctx = canvas.getContext('2d');

  if (isEmpty(mappingInfo)) return;

  const isTextObject = isFbTextObject(target);
  const isMapped = mappingInfo.mapped;
  const iconOptions = {
    [`${true}-${true}`]: IMAGE_LOCAL.LOCATION_WHITE,
    [`${true}-${false}`]: IMAGE_LOCAL.LOCATION_DISABLED_WHITE,
    [`${false}-${true}`]: IMAGE_LOCAL.LOCATION_PURPLE,
    [`${false}-${false}`]: IMAGE_LOCAL.LOCATION_DISABLED_PURPLE
  };
  const customIcon = IMAGE_LOCAL.LOCATION_DISABLED_GRAY;

  const iconSrc = mappingInfo.isCustom
    ? customIcon
    : iconOptions[`${isTextObject}-${isMapped}`];

  const icon = await createMediaOverlay(iconSrc);

  const color = mappingInfo.color;
  const value = mappingInfo.value;

  const [background, foreground] =
    !isTextObject || mappingInfo.isCustom ? ['white', color] : [color, 'white'];

  const { top, left, width, height } = target.getBoundingRect();
  const centerX = left + width / 2;
  const centerY = top + height / 2;

  // box size
  const w = isMapped ? 41 : 25;
  const h = 24;
  const x = left + 5;
  const y = top + 5;
  const r = 5;
  const calcAngle = (Math.PI * (angle % 360)) / 180;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(calcAngle);
  ctx.translate(-centerX, -centerY);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.clip();

  ctx.strokeStyle = foreground;
  ctx.fillStyle = background;
  ctx.lineWidth = 3;
  ctx.fill();
  ctx.stroke();

  const iconWidth = 16;
  const iconHeight = 16;

  ctx.drawImage(icon, left + 9, top + 9, iconWidth, iconHeight);

  if (isMapped) {
    // draw text
    ctx.font = '12px "MuseoSans 500"';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = foreground;
    ctx.fillText(`${value}`, left + 33, top + 19);
  }

  ctx.restore();
};
