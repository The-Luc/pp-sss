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

  if (objType === 'string') return obj.trim().length === 0;

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

    if (k === 'color') {
      cssStyle['fill'] = value;

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

    style[k] = value;
  });

  return style;
};
