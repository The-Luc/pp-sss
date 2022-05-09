import { OVERLAY_BACKGROUND_COLOR } from '@/common/constants';

/**
 * To draw a rounded box onto an element
 * @param {Object} ctx context canvas
 * @param {Object} boundingRect bounding box of objects
 * @param {Number} centerX
 * @param {Number} centerY
 * @param {Boolean} showOverlay
 * @param {Boolean} isImage
 */
const drawRoundedRect = function(
  ctx,
  boundingRect,
  centerX,
  centerY,
  showOverlay,
  isImage
) {
  if (!showOverlay?.isDisplayed) return;
  // box size
  const w = 114;
  const h = 60;

  const { top, left, width, height } = boundingRect;

  ctx.save();

  // render overlay background
  ctx.fillStyle =
    showOverlay.value > 0 ? showOverlay.color : OVERLAY_BACKGROUND_COLOR;

  ctx.fillRect(left, top, width, height);

  const x = centerX - w / 2;
  const y = centerY - h / 2;
  const r = 18;

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.clip();

  ctx.fillStyle = isImage ? '#58595B' : 'white';
  ctx.fillRect(centerX - w / 2, centerY - h / 2, w, h);

  ctx.restore();
};

export const handleRenderOverlayText = function(ctx) {
  if (!this?.showOverlay?.isDisplayed) return;

  const { width, height } = this.getBoundingRect(true);
  const { x: centerX, y: centerY } = this.getCenterPoint();
  const boundingRect = { left: this.left, top: this.top, width, height };

  drawRoundedRect(ctx, boundingRect, centerX, centerY, this.showOverlay);

  ctx.save();

  const { a, b, c, d, e } = ctx.getTransform();
  const textContent =
    this.showOverlay.value > 0 ? this.showOverlay.value : 'Add';

  // move text down a little bit
  ctx.setTransform(a, b, c, d, e, 2);
  ctx.fillStyle = 'black';
  ctx.font = '35px "MuseoSans 300"';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(`${textContent}`, centerX, centerY);
  ctx.restore();
};

export const handleRenderOverlayImage = function(ctx) {
  if (!this?.showOverlay?.isDisplayed) return;

  const { width, height } = this.getBoundingRect();
  const { a, d } = ctx.getTransform();

  const w = width / a;
  const h = height / d;
  const left = -w / 2;
  const top = -h / 2;

  const boundingRect = { left, top, width: w, height: h, a, d };
  const isImage = true;

  const centerX = 0;
  const centerY = 0;

  drawRoundedRect(
    ctx,
    boundingRect,
    centerX,
    centerY,
    this.showOverlay,
    isImage
  );

  ctx.save();
  ctx.fillStyle = 'white';
  ctx.font = '35px "MuseoSans 300"';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(`${this.showOverlay.value}`, centerX, centerY);
  ctx.restore();
};
