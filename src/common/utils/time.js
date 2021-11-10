import moment from 'moment';

import { isEmpty } from '@/common/utils';

import { DATE_FORMAT, MOMENT_TYPE } from '@/common/constants';

/**
 * Get total different time (base on compare type) between 2 dates (included beginning)
 *
 * @param   {String}  beginDate (in format 'MM/DD/YY')
 * @param   {String}  endDate   (in format 'MM/DD/YY')
 * @returns {Number}            total different day
 */
export const getDiffsTime = (beginDate, endDate, compareType) => {
  const beginTime = moment(beginDate, DATE_FORMAT.BASE);
  const endTime = moment(endDate, DATE_FORMAT.BASE);

  return endTime.diff(beginTime, compareType, false) + 1;
};

/**
 * Get total different day between 2 dates (included begin date)
 *
 * @param   {String}  beginDate (in format 'MM/DD/YY')
 * @param   {String}  endDate (in format 'MM/DD/YY')
 * @returns {Number}  total different day
 */
export const getDiffDays = (beginDate, endDate) => {
  return getDiffsTime(beginDate, endDate, MOMENT_TYPE.DAY);
};

/**
 * Get total different day between end date and first date of month of begin date
 *
 * @param   {String}  beginDate (in format 'MM/DD/YY')
 * @param   {String}  endDate   (in format 'MM/DD/YY')
 * @returns {Number}            total different day
 */
export const getDiffDaysFOM = (beginDate, endDate) => {
  const beginTime = moment(beginDate, DATE_FORMAT.BASE);

  beginTime.set(MOMENT_TYPE.DATE, 1);

  return getDiffDays(beginTime.format(DATE_FORMAT.BASE), endDate);
};

/**
 * Get total different day between first date of month of begin date
 * & last date of month of end date
 *
 * @param   {String}  beginDate (in format 'MM/DD/YY')
 * @param   {String}  endDate   (in format 'MM/DD/YY')
 * @returns {Number}            total different day
 */
export const getDiffDaysFOMToEOM = (beginDate, endDate) => {
  const endTime = moment(endDate, DATE_FORMAT.BASE);

  endTime.set(MOMENT_TYPE.DATE, endTime.daysInMonth());

  return getDiffDaysFOM(beginDate, endTime.format(DATE_FORMAT.BASE));
};

/**
 * Get total different month between 2 dates (included month of begin date)
 *
 * @param   {String}  beginDate (in format 'MM/DD/YY')
 * @param   {String}  endDate   (in format 'MM/DD/YY')
 * @returns {Number}            total different day
 */
export const getDiffMonths = (beginDate, endDate) => {
  const beginTime = moment(beginDate, DATE_FORMAT.BASE);
  const endTime = moment(endDate, DATE_FORMAT.BASE)
    .add(1, MOMENT_TYPE.MONTH)
    .set(MOMENT_TYPE.DATE, beginTime.date());

  return getDiffsTime(
    beginDate,
    endTime.format(DATE_FORMAT.BASE),
    MOMENT_TYPE.MONTH
  );
};

/**
 * To convert time string to seconds
 * @param {String} time time in format "hh:mm:ss"
 * @returns number of seconds
 */
export const parseToSecond = time => {
  if (isEmpty(time)) return;

  return +time.split(':').reduce((acc, val) => 60 * acc + +val);
};

/**
 * Convert API date to date in base format
 * @param   {String}  apiDate api date
 * @returns {String}          date in base format
 */
export const apiToBaseDate = apiDate => {
  if (isEmpty(apiDate)) return '';

  return moment(new Date(apiDate)).format(DATE_FORMAT.BASE);
};

/**
 * Convert API date to short date format
 * @param   {String}  apiDate api date
 * @returns {String}          date in short format
 */
export const apiToShortDate = apiDate => {
  if (isEmpty(apiDate)) return '';

  return moment(new Date(apiDate)).format(DATE_FORMAT.SHORT);
};
