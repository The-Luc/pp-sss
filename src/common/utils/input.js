import { isEmpty } from './util';
import { isFloat, isInteger } from './number';

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
  unit = ''
) => {
  if (isEmpty(data)) {
    return { isValid: false, value: '' };
  }
  const stringVal = String(data).trim();
  const [stringValueWithUnit, stringUnit] = stringVal.split(' ');
  const foundOption = getMatchedValueFromOptions(stringVal, items);
  if (foundOption) {
    return { isValid: true, value: foundOption.value };
  }
  if (decimalPlaces > 0 && !isFloat(stringVal)) {
    return { isValid: false, value: '' };
  }

  const value = decimalPlaces > 0 ? parseFloat(stringVal) : parseInt(data, 10);

  if (value < min || value > max) {
    return { isValid: false, value: '' };
  }

  if (unit && stringUnit && unit !== stringUnit) {
    return {
      isValid: false,
      value: ''
    };
  }

  if (decimalPlaces <= 0 && !isInteger(stringValueWithUnit)) {
    return { isValid: false, value: '' };
  }
  return {
    isValid: true,
    value: decimalPlaces > 0 ? value.toFixed(decimalPlaces) : value
  };
};
