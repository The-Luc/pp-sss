import { isEmpty } from './util';

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
 * Handle number change consistently with validation rules
 * @param {Object | Number | String} data the input value
 * @param {Number} min the smallest value accepted
 * @param {Number} max the biggest value accepted
 * @param {Number} decimalPlaces number of decimal places allow
 * @param {Array} items all available options
 * @returns {Number|String|Boolean} number/string value if the input is found valid, else return false
 */
export const getNumberOnChanged = (
  data,
  min,
  max,
  decimalPlaces = 0,
  items = []
) => {
  if (isEmpty(data)) {
    return false;
  }
  const isString = typeof data === 'string';
  const stringVal = isString ? data : String(data.value);
  const foundOption = items.find(
    i =>
      String(i.name).toLowerCase() == stringVal.toLowerCase() ||
      String(i.value).toLowerCase() == stringVal.toLowerCase()
  );
  if (foundOption) {
    return foundOption.value;
  }
  if (decimalPlaces > 0 && !isFloat(stringVal)) {
    return false;
  }
  if (decimalPlaces <= 0 && !isInteger(stringVal)) {
    return false;
  }
  const value = decimalPlaces > 0 ? parseFloat(stringVal) : parseInt(data, 10);
  const acceptValue = value > max ? max : value < min ? min : value;
  return decimalPlaces > 0 ? acceptValue.toFixed(decimalPlaces) : acceptValue;
};
