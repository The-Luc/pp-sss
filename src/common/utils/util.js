import moment from 'moment';

import { DATE_FORMAT, MOMENT_TYPE } from '@/common/constants';

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
 * Get total sheets into sections of book
 *
 * @param   {Array} sections - All sections of book
 * @returns {Array} - Total sheets
 */
export const getAllSheets = sections => {
  let sheets = [];
  sections.forEach(s => {
    sheets = [...sheets, ...s.sheets];
  });
  return sheets;
};

/**
 * Get layout option from list layouts option by id
 *
 * @param   {Array} listLayouts - List layouts. It include themeId, layout type
 * @param   {Array} listLayoutType - List layout option of select
 * @param   {Number} layoutId - Layout id of sheet
 * @returns {Object} Object layout option
 */
export const getLayoutOptSelectedById = (
  listLayouts,
  listLayoutType,
  layoutId
) => {
  const layoutType = listLayouts.find(layout => layout.id === layoutId).type;
  const layoutOpt = listLayoutType.find(layout => layout.value === layoutType);
  return layoutOpt;
};

/**
 * Get theme option from list themes option by id
 *
 * @param   {Array} listThemeOpts - List theme options.
 * @param   {Number} themeId - Theme id of sheet
 * @returns {Object} Object theme option
 */
export const getThemeOptSelectedById = (listThemeOpts, themeId) => {
  return listThemeOpts.find(themeOpt => themeOpt.id === themeId);
};

/**
 * Check if the object is empty or not
 *
 * @param   {Object}  obj the object to be checked
 * @returns {Boolean} checked object is empty or not
 */
export const isEmpty = obj => {
  if (obj === null) return true;

  const objType = typeof obj;

  if (objType === 'undefined') return true;

  if (objType === 'string') {
    return obj.trim().length === 0 || obj.trim() === '\n';
  }

  if (objType === 'object' && isNaN(parseInt(obj.length, 10))) {
    return JSON.stringify(obj) === JSON.stringify({});
  }

  if (objType === 'object') return obj.length === 0;

  return false;
};

/**
 * Convert stored style to css style
 *
 * @param   {Object}  style stored style
 * @returns {Object}        css style
 */
export const styleToCssStyle = style => {
  const cssStyle = {};

  Object.keys(style).forEach(k => {
    const value = style[k];

    if (k === 'fontSize') {
      cssStyle[k] = `${value}px`;

      return;
    }

    if (k === 'isBold') {
      cssStyle['fontWeight'] = value ? 'bold' : 'normal';

      return;
    }

    if (k === 'isItalic') {
      cssStyle['fontStyle'] = value ? 'italic' : 'normal';

      return;
    }

    if (k === 'isUnderline') {
      cssStyle['textDecoration'] = value ? 'underline' : 'none';

      return;
    }

    cssStyle[k] = value;
  });

  return cssStyle;
};

/**
 * Convert stored style to fabric style
 *
 * @param   {Object}  style stored style
 * @returns {Object}        fabric style
 */
export const styleToFabricStyle = style => {
  const fabricStyle = {};

  Object.keys(style).forEach(k => {
    const value = style[k];

    if (k === 'isBold') {
      fabricStyle['fontWeight'] = value ? 'bold' : '';

      return;
    }

    if (k === 'isItalic') {
      fabricStyle['fontStyle'] = value ? 'italic' : '';

      return;
    }

    if (k === 'isUnderline') {
      fabricStyle['underline'] = value;

      return;
    }

    if (k === 'color') {
      fabricStyle['fill'] = value;

      return;
    }

    if (k === 'fontSize') {
      fabricStyle['originalFontSize'] = parseInt(`${value}`, 10);

      return;
    }

    fabricStyle[k] = value;
  });

  return fabricStyle;
};

/**
 * Convert fabric style to stored style
 *
 * @param   {Object}  fabricStyle fabric style
 * @returns {Object}              stored style
 */
export const fabricStyleToStyle = fabricStyle => {
  const style = {};

  Object.keys(fabricStyle).forEach(k => {
    const value = fabricStyle[k];

    if (k === 'fontWeight') {
      style['isBold'] = !isEmpty(value);

      return;
    }

    if (k === 'fontStyle') {
      style['isItalic'] = !isEmpty(value);

      return;
    }

    if (k === 'underline') {
      style['isUnderline'] = value;

      return;
    }

    if (k === 'fill') {
      style['color'] = value;

      return;
    }

    if (k === 'originalFontSize') {
      style['fontSize'] = parseInt(`${value}`, 10);

      return;
    }

    style[k] = value;
  });

  return style;
};

/**
 * Convert stored properties to fabric properties
 *
 * @param   {Object}  prop  stored properties
 * @returns {Object}        fabric properties
 */
export const propToFabricProp = prop => {
  const fabricProp = {};

  Object.keys(prop).forEach(k => {
    fabricProp[k] = prop[k];
  });

  return fabricProp;
};

/**
 * Convert fabric properties to stored properties
 *
 * @param   {Object}  fabricProp  fabric properties
 * @returns {Object}              stored properties
 */
export const fabricPropToProp = fabricProp => {
  const prop = {};

  Object.keys(fabricProp).forEach(k => {
    prop[k] = fabricProp[k];
  });

  return prop;
};

/**
 * Handle scroll to element's position with configs
 *
 * @param   {Ref}  el  Element need to scroll
 * @param   {Object}  opts  Options when scrolling
 */
export const scrollToElement = (el, opts) => {
  const baseOpts = {
    behavior: 'smooth',
    block: 'nearest'
  };

  el.scrollIntoView({
    ...baseOpts,
    ...opts
  });
};
