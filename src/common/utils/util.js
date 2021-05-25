import moment from 'moment';

/**
 * Get the next id of item list
 *
 * @param   {Array}   items list of item will get next id
 * @returns {Number}  the next id
 */
export const nextId = items => {
  const maxId = Math.max(...items.map(e => e.id), 0);

  return maxId + 1;
};

/**
 * Get total different day between 2 dates in day (included begin date)
 *
 * @param   {String}  beginDate (in format 'MM/DD/YY')
 * @param   {String}  endDate (in format 'MM/DD/YY')
 * @returns {Number}  total different day
 */
export const getDiffDays = (beginDate, endDate) => {
  const beginTime = moment(beginDate, 'MM/DD/YY').set('date', 1);
  const endTime = moment(endDate, 'MM/DD/YY');

  return endTime.diff(beginTime, 'days', false) + 1;
};
