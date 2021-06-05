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
  const { x: objectPostionX, y: objecPositionY } = objCoord;
  const { width: objectWidth, height: objectHeight } = objSize;

  const ratioLayoutWidth = canvasWidth / layoutWidth;
  const ratioLayoutHeight = canvasHeight / layoutHeight;
  const centerLeftPoint = (objectWidth / 2) * ratioLayoutWidth;
  const centerTopPoint = (objectHeight / 2) * ratioLayoutHeight;

  let left = objectPostionX * ratioLayoutWidth - centerLeftPoint;
  let top = objecPositionY * ratioLayoutHeight - centerTopPoint;
  const width = objectWidth * ratioLayoutWidth;
  const height = objectHeight * ratioLayoutHeight;
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
