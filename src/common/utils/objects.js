/**
 * Computed ratio and return coordinate and dimenssion of object
 * @param {Object} objCoord - Coordinate of object include x and y
 * @param {String} objSize - The size of object box include width and height
 * @param {Ref} targetCanvas - Target canvas to draw objects
 * @param {Object} layoutSize - The size of layout  include width and height
 * @return {Object} {left, top, width, height} - Return coordinate and dimenssion of object after computed ratio
 */
export const computedObjectData = (
  objCoord,
  objSize,
  targetCanvas,
  layoutSize,
  position
) => {
  const { width: canvasWidth, height: canvasHeight } = targetCanvas;
  const { width: layoutWidth, height: layoutHeight } = layoutSize;

  const ratioWidth = canvasWidth / layoutWidth;
  const ratioHeight = canvasHeight / layoutHeight;
  const centerLeftPoint = (objSize.width / 2) * ratioWidth;
  const centerTopPoint = (objSize.height / 2) * ratioHeight;

  let left = objCoord.x * ratioWidth - centerLeftPoint;
  let top = objCoord.y * ratioHeight - centerTopPoint;
  const width = objSize.width * ratioWidth;
  const height = objSize.height * ratioHeight;
  // if (position === 'right') {// TODO later
  //   // Adjust left position when use select right from single page
  //   left += canvasWidth / 2;
  // }
  return {
    left,
    top,
    width,
    height
  };
};
