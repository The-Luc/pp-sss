import { CORNER_SIZE } from '@/common/constants';

/**
 * Change cursor in mtl corner by override drawControls in fabric
 *
 * @param   {Canvas object}  object Canvas object
 * @returns {Canvas object}  Current canvas object with new configs
 */
export const useDrawControls = object => {
  object.drawControls = function(ctx, styleOverride) {
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
      ctx.strokeStyle =
        styleOverride.cornerStrokeColor || this.cornerStrokeColor;
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
};
