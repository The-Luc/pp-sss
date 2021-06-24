/**
 * Computed ratio and return coordinate and dimension of object
 * @param {Object} objCoord - Coordinate of object include x and y
 * @param {Object} objSize - The size of object box include width and height
 * @param {Ref} targetCanvas - Target canvas to draw objects
 * @param {Object} layoutSize - The size of layout  include width and height
 * @return {Object} {left, top, width, height} - Return coordinate and dimension of object after computed ratio
 */
export const computedObjectData = (
  objCoord,
  objSize,
  targetCanvas,
  layoutSize
  // position
) => {
  const { width: canvasWidth, height: canvasHeight } = targetCanvas;
  const { width: layoutWidth, height: layoutHeight } = layoutSize;
  const { x: objectPositionX, y: objectPositionY } = objCoord;
  const { width: objectWidth, height: objectHeight } = objSize;

  const ratioLayoutWidth = canvasWidth / layoutWidth;
  const ratioLayoutHeight = canvasHeight / layoutHeight;
  const centerLeftPoint = (objectWidth / 2) * ratioLayoutWidth;
  const centerTopPoint = (objectHeight / 2) * ratioLayoutHeight;

  let left = objectPositionX * ratioLayoutWidth - centerLeftPoint;
  let top = objectPositionY * ratioLayoutHeight - centerTopPoint;
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

/**
 * Compute new dimension of object when user input new size data with constrain condition
 * @param {Object} newSize - Dimensional data user input, maybe width|height
 * @param {Object} oldSize - The current/old size of object
 * @param {Number} minSize - The minimum size of object
 * @param {Number} maxSize - The maximum size of object
 * @param {Boolean} isConstrain - The object is constrain mode or not
 * @return {Object} {width, height} - Return new size of object after calculated
 */
export const computedObjectSize = (
  newSize,
  oldSize,
  minSize,
  maxSize,
  isConstrain
) => {
  if (!isConstrain) return { ...oldSize, ...newSize };

  const key = Object.keys(newSize)[0];
  const ratio = newSize[key] / oldSize[key];
  const dimensional = key === 'width' ? 'height' : 'width';
  const newValue = oldSize[dimensional] * ratio;
  const dimensionalValue =
    newValue < minSize ? minSize : newValue > maxSize ? maxSize : newValue;

  return { ...oldSize, ...newSize, [dimensional]: dimensionalValue };
};
