/**
 * Check if the input number is a valid integer
 * @param {String|Number} val the numeric value to be checked
 * @returns {Boolean} true if the input number is a valid integer
 */
export const isInteger = val => /^-?(0|[1-9]\d*)$/.test(val);

/**
 * Check if the input number is a valid positive integer
 * @param {String|Number} val the numeric value to be checked
 * @returns {Boolean} true if the input number is a valid positive integer
 */
export const isPositiveInteger = val => /^(0|[1-9]\d*)$/.test(val);

/**
 * Check if the input number is a valid float
 * @param {String|Number} val the numeric value to be checked
 * @returns {Boolean} true if the input number is a valid float
 */
export const isFloat = val => /^-?(0|[1-9]\d*)(\.\d+)?$/.test(val);

/**
 * Check if the input number is a valid positive float
 * @param {String|Number} val the numeric value to be checked
 * @returns {Boolean} true if the input number is a valid positive float
 */
export const isPositiveFloat = val => /^(0|[1-9]\d*)(\.\d+)?$/.test(val);

/**
 * Check if the input number is valid float/integer depend on decimalPlaces
 * @param {Number} val the numeric value to be checked
 * @returns {Boolean} true if the input number is valid
 */
export const isValidNumber = (val, decimalPlaces = 0) => {
  if (decimalPlaces > 0 && !isFloat(val)) {
    return false;
  }

  if (decimalPlaces <= 0 && !isInteger(val)) {
    return false;
  }

  return true;
};

/**
 * Check if the number is inside boundary min/max
 * @param {Number} val the numeric value
 * @param {Number} min the smallest value allowed
 * @param {Number} max the biggest value allowed
 * @returns {Boolean} true if min <= value <= max
 */
export const isNumberInBoundary = (val, min, max) => {
  if (val < min || val > max) return false;

  return true;
};

/**
 * Get the valid value within boundary min/max, return min if value too small
 * return max if value too big
 * @param {Number} val the numeric value
 * @param {Number} min the smallest value allowed
 * @param {Number} max the biggest value allowed
 * @returns {Number} the valid value within boundary or min/max if not valid
 */
export const getNumberInBoundary = (val, min, max) => {
  if (val < min) return min;

  if (val > max) return max;

  return val;
};

/**
 * Split the number by decimal count
 * @param {String|Number} value the numeric value to be split
 * @param {Number} decimalCount decimal count want split
 * @returns {Number} The number after split
 */
export const splitNumberByDecimal = (value, decimalCount = 2) => {
  let [trunc, decimal] = String(value).split('.');

  if (!decimal) return parseFloat(trunc);

  if (String(decimal).length > 2) {
    decimal = String(decimal).substring(0, decimalCount);
  }
  return parseFloat(`${trunc}.${decimal}`);
};

export const percentToHex = percent => {
  const intValue = Math.round((percent / 100) * 255);
  const hexValue = intValue.toString(16);
  return hexValue.padStart(2, '0').toUpperCase();
};

export const hexToPercent = alphaHexString => {
  return Math.round((parseInt(alphaHexString, 16) / 255) * 100);
};
