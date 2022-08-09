import { OVERLAY_BACKGROUND_COLOR } from '@/common/constants';
import { getDistance } from '@/common/utils';

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

  const { top, left, width, height } = boundingRect;
  const widthForText = 114;
  const heightForText = 60;

  const widthForImage = 40;
  const heightForImage = 20;

  const w = isImage ? widthForImage : widthForText;
  const h = isImage ? heightForImage : heightForText;

  ctx.save();

  // render overlay background
  ctx.fillStyle =
    showOverlay.value > 0 ? showOverlay.color : OVERLAY_BACKGROUND_COLOR;

  if (angle) {
    ctx.save();
    // this translate and rotate is used for drawing overlay background
    ctx.translate(left, top);
    ctx.rotate(angle);
    ctx.translate(-left, -top);
    ctx.fillRect(left, top, width, height);
    ctx.restore();

    // this translate and rotate is used for drawing rounded box and a number inside it
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.translate(-centerX, -centerY);
  } else {
    ctx.fillRect(left, top, width, height);
  }

  const x = centerX - w / 2;
  const y = centerY - h / 2;
  // r: radius value is randomly choosen to make the corner looks good
  const r = isImage ? 7 : 18;

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

  const [tl, tr, br] = this.getCoords(true);

  const width = getDistance(tl, tr);
  const height = getDistance(tr, br);

  const { x: centerX, y: centerY } = this.getCenterPoint();
  const boundingRect = { left: tl.x, top: tl.y, width, height };
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

  if (angle) {
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.translate(-centerX, -centerY);
  }

  ctx.fillStyle = 'white';
  ctx.font = '35px "MuseoSans 300"';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(`${this.showOverlay.value}`, centerX, centerY);
  ctx.restore();
};

export const handleRenderOverlayImage = function(ctx) {
  if (!this?.showOverlay?.isDisplayed) return;

  // only image has scale value, so we need to take it into account
  // the context of image object has been modified so can not get corner points
  // we cannot use getBoudingRect() when object is rotated
  // so we have to calc its dimensions based on conner positions
  const [tl, tr, br] = this.getCoords();

  const width = getDistance(tl, tr);
  const height = getDistance(tr, br);

  const left = -width / 2;
  const top = -height / 2;

  // Reset scale and skew values of transform matix
  const { e, f } = ctx.getTransform();
  ctx.setTransform(1, 0, 0, 1, e, f);

  const boundingRect = { left, top, width, height };

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
  ctx.fillStyle = 'black';
  ctx.font = `${11}px "MuseoSans 300"`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(`${this.showOverlay.value}`, centerX, centerY);
  ctx.restore();
};
