import { isEmpty } from './util';
import {
  isValidNumber,
  getNumberInBoundary,
  isNumberInBoundary,
  splitNumberByDecimal
} from './number';

/**
 * Get the value of the input data
 * @param {Object|String} data - the data return from input fields
 * @returns {String} the input value
 */
export const getValueInput = data => {
  if (typeof data === 'object') {
    // value selected from dropdowns
    return data.value;
  }
  // value from input boxes
  return data;
};

/**
 * Get the valid option that match the data
 * @param {String} data - the value to match
 * @param {Array} options - the list of options { name, value } to choose from
 * @returns {Object} the matched option { name, value } or undefined if not found
 */
export const getMatchedValueFromOptions = (data, options = []) =>
  options.find(
    i =>
      String(i.name).toLowerCase() == String(data).toLowerCase() ||
      String(i.value).toLowerCase() == String(data).toLowerCase()
  );

/**
 * Handle number input change consistently with validation rules
 * @param {Number | String} data the input value
 * @param {Number} min the smallest value accepted
 * @param {Number} max the biggest value accepted
 * @param {Number} decimalPlaces number of decimal places allow
 * @param {Array} items all available options
 * @returns {Object} the result object { isValid: Boolean, value: String }
 */
export const validateInputOption = (
  data,
  min,
  max,
  decimalPlaces = 0,
  items = [],
  unit = '',
  fallbackMinMax = false
) => {
  if (isEmpty(data)) {
    return { isValid: false, value: '' };
  }
  const stringVal = String(data)
    .replace(/\s+/g, ' ')
    .trim();
  const [stringValueWithUnit, stringUnit] = stringVal.split(' ');

  const foundOption = getMatchedValueFromOptions(stringVal, items);
  if (foundOption) {
    return { isValid: true, value: foundOption.value };
  }

  if (!isValidNumber(stringValueWithUnit, decimalPlaces)) {
    return { isValid: false, value: '' };
  }

  if (stringUnit && unit !== stringUnit) {
    return { isValid: false, value: '' };
  }

  let isForce = false;
  let value =
    decimalPlaces > 0
      ? splitNumberByDecimal(parseFloat(stringVal), decimalPlaces)
      : parseInt(data, 10);

  if (fallbackMinMax && !isNumberInBoundary(value, min, max)) {
    value = getNumberInBoundary(value, min, max);
    isForce = true;
  }

  if (!isNumberInBoundary(value, min, max)) {
    return { isValid: false, value: '' };
  }

  return { isValid: true, value, isForce };
};

/**
 * Get the value of data without the unit
 *
 * @param   {String}  data  the input value
 * @param   {String}  unit  the unit
 * @returns {String}        value without unit
 */
export const getValueWithoutUnit = (data, unit) => {
  if (data.indexOf(unit) !== data.length - unit.length) return data;

  return data.substring(0, data.length - unit.length);
};
