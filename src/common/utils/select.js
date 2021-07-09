/**
 * Get the selected option object standard
 * @param {Object | Number | String} data the selected payload
 * @param {String} unit the unit suffix (pt, px)
 * @returns the selected object { name, value }
 */
export const getSelectedOption = (data, unit, gap = ' ') => {
  if (typeof data === 'object') {
    return { name: data.name, value: data.value };
  }

  return { name: unit ? `${data}${gap}${unit}` : data, value: data };
};
