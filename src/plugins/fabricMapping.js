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
  isImage,
  angle
) {
  if (!showOverlay?.isDisplayed) return;

  const { top, left, width, height, a, d } = boundingRect;
  const widthForText = 114;
  const heightForText = 60;

  const widthForImage = 38 / a;
  const heightForImage = 20 / d;

  const w = isImage ? widthForImage : widthForText;
  const h = isImage ? heightForImage : heightForText;

  ctx.save();

  if (angle) {
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.translate(-centerX, -centerY);
  }
  // render overlay background
  ctx.fillStyle =
    showOverlay.value > 0 ? showOverlay.color : OVERLAY_BACKGROUND_COLOR;
  ctx.fillRect(left, top, width, height);

  const x = centerX - w / 2;
  const y = centerY - h / 2;
  const r = isImage ? 20 / (a + d) / 2 : 18;

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.clip();

  ctx.fillStyle = isImage ? 'white' : '#58595B';
  ctx.fillRect(centerX - w / 2, centerY - h / 2, w, h);

  ctx.restore();
};

export const handleRenderOverlayText = function(ctx) {
  if (!this?.showOverlay?.isDisplayed) return;

  const { width, height } = this.getBoundingRect(true);
  const { x: centerX, y: centerY } = this.getCenterPoint();
  const boundingRect = { left: this.left, top: this.top, width, height };
  const angle = (Math.PI * (this.angle % 360)) / 180;

  drawRoundedRect(
    ctx,
    boundingRect,
    centerX,
    centerY,
    this.showOverlay,
    false,
    angle
  );

  ctx.save();
  const { a, b, c, d, e } = ctx.getTransform();

  // move text down a little bit
  ctx.setTransform(a, b, c, d, e, 2);
  ctx.fillStyle = 'white';
  ctx.font = '35px "MuseoSans 300"';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(`${this.showOverlay.value}`, centerX, centerY);
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

  const fontSize = 45 / (a + d) / 2;
  ctx.save();
  ctx.fillStyle = 'black';
  ctx.font = `${fontSize}px "MuseoSans 300"`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(`${this.showOverlay.value}`, centerX, centerY);
  ctx.restore();
};
