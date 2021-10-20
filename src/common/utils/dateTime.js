import { isEmpty } from './util';

/**
 * Convert API date to date in base format
 * @param   {String}  apiDate api date
 * @returns {String}          date in base format
 */
export const apiToBaseDate = apiDate => {
  if (isEmpty(apiDate)) return '';

  const [year, month, day] = apiDate.substring(2, 10).split('-');

  return `${month}/${day}/${year}`;
};
