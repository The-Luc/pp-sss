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
 * Split the number by decimal count
 * @param {String|Number} value the numeric value to be split
 * @param {Number} decimalCount decimal count want split
 * @returns {Number} The number after split
 */
export const splitNumberByDecimal = (value, decimalCount = 2) => {
  const trunc = Math.trunc(value);
  let decimal = String(value).split('.')[1];

  if (!decimal) return parseFloat(trunc);

  if (String(decimal).length > 2) {
    decimal = String(decimal).substring(0, decimalCount);
  }
  if (trunc == '-0') {
    return -parseFloat(`${trunc}.${decimal}`);
  }
  return parseFloat(`${trunc}.${decimal}`);
};
