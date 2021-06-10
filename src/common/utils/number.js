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
