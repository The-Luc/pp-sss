import { isEmpty } from './util';

/**
 * Get the selected option object standard
 * @param {Object | Number | String} data the selected payload
 * @param {String} unit the unit suffix (pt, px)
 * @param {String} displayData display data
 * @returns the selected object { name, value }
 */
export const getSelectedOption = (data, unit, displayData = '') => {
  if (typeof data === 'object') {
    return { name: data.name, value: data.value };
  }

  const hasUnit = unit ? `${data} ${unit}` : data;
  const name = isEmpty(displayData) ? hasUnit : displayData;

  return { name, value: data };
};
