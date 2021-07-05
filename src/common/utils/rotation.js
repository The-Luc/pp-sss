/**
 * Calculate current angle base on x, y
 * @param {Number} x - the current x axis
 * @param {Number} y - the current y axis
 * @returns {Number} the angle in deg
 */
export const calcAngle = (x, y) => (180 / Math.PI) * Math.atan2(y, x);

/**
 * Get valid angle number from -360 to 360
 * @param {Number} num - the current angle value
 * @returns {Number} angle number
 */
export const numberToAngle = num => num % 360;

/**
 * Convert number to correct positive angle value
 * @param {Number} num - the input number from user
 * @returns {Number}
 */
export const numberToPositiveAngle = num => {
  const angle = numberToAngle(num);
  return angle >= 0 ? angle : 360 - -angle;
};

/**
 * Get list of snap angles for rotation
 * @returns {Array<Number>} snap angles by 45deg
 */
export const getSnapAngles = () => {
  const length = (360 * 2) / 45 + 1;
  return Array.from({ length }, (_, i) => i * 45 - 360);
};

/**
 * Find the closest snap angle
 * @param {Number} angle - the current rotate angle
 * @returns {Number} the snap angle
 */
export const toSnapAngle = angle => {
  const angles = getSnapAngles();
  for (let index = 0; index < angles.length - 1; index++) {
    const curAngle = angles[index];
    // found match, return
    if (angle === curAngle) return curAngle;
    const nextAngle = angles[index + 1];
    // found match, return
    if (angle === nextAngle) return nextAngle;

    // match between
    if (curAngle < angle && angle < nextAngle) {
      // return the smaller ends
      if (angle - curAngle < nextAngle - angle) {
        return curAngle;
      }
      return nextAngle;
    }
  }
};
