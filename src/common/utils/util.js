import { cloneDeep, merge } from 'lodash';
import moment from 'moment';

import { DATE_FORMAT, MOMENT_TYPE } from '@/common/constants';

import { scaleSize } from './canvas';

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
 * Map source object to other object using rules
 *
 * @param   {Object}  sourceObject  the source object is used to map
 * @param   {Object}  rules         rules use when mapping
 *
 * @returns {Object}                mapped object
 */
export const mapObject = (sourceObject, rules) => {
  const resultObject = {};

  Object.keys(sourceObject).forEach(k => {
    if (rules.restrict.indexOf(k) >= 0) return;

    if (Array.isArray(sourceObject[k])) {
      resultObject[k] = sourceObject[k];

      return;
    }

    if (typeof sourceObject[k] === 'object') {
      const useRules = cloneDeep(rules);
      const subRules = isEmpty(rules.data[k]) ? {} : rules.data[k];

      merge(useRules, subRules);

      const subObject = mapObject(sourceObject[k], useRules);

      merge(resultObject, subObject);

      return;
    }

    if (isEmpty(rules.data[k])) {
      resultObject[k] = sourceObject[k];

      return;
    }

    const mapName = rules.data[k].name;

    resultObject[mapName] = isEmpty(rules.data[k].parse)
      ? sourceObject[k]
      : rules.data[k].parse(sourceObject[k]);
  });

  return resultObject;
};

/**
 * Convert stored style to css style
 *
 * @param   {Object}  style stored style
 * @returns {Object}        css style
 */
export const toCssStyle = style => {
  const mapRules = {
    data: {
      isBold: {
        name: 'fontWeight',
        parse: value => (value ? 'bold' : 'normal')
      },
      isItalic: {
        name: 'fontStyle',
        parse: value => (value ? 'italic' : 'normal')
      },
      isUnderline: {
        name: 'textDecoration',
        parse: value => (value ? 'underline' : 'none')
      },
      fontSize: {
        name: 'fontSize',
        parse: value => `${value}px`
      }
    },
    restrict: []
  };

  return mapObject(style, mapRules);
};

/**
 * Convert stored text properties to fabric properties
 *
 * @param   {Object}  prop  stored text properties
 * @returns {Object}        fabric properties
 */
export const toFabricTextProp = prop => {
  const mapRules = {
    data: {
      x: {
        name: 'left',
        parse: value => scaleSize(value)
      },
      y: {
        name: 'top',
        parse: value => scaleSize(value)
      },
      isBold: {
        name: 'fontWeight',
        parse: value => (value ? 'bold' : '')
      },
      isItalic: {
        name: 'fontStyle',
        parse: value => (value ? 'italic' : '')
      },
      isUnderline: {
        name: 'underline'
      },
      color: {
        name: 'fill'
      },
      fontSize: {
        name: 'fontSize',
        parse: value => scaleSize(value)
      },
      horiziontal: {
        name: 'textAlign'
      },
      vertical: {
        name: 'verticalAlign'
      },
      letterSpacing: {
        name: 'charSpacing'
      }
    },
    restrict: [
      'id',
      'size',
      'type',
      'textCase',
      'text',
      'border',
      'shadow',
      'flip'
    ]
  };

  return mapObject(prop, mapRules);
};

/**
 * Convert stored text border properties to fabric properties
 *
 * @param   {Object}  style stored text border properties
 * @returns {Object}        fabric properties
 */
export const toFabricTextBorderProp = prop => {
  const mapRules = {
    data: {
      x: {
        name: 'left',
        parse: value => scaleSize(value)
      },
      y: {
        name: 'top',
        parse: value => scaleSize(value)
      },
      fill: {
        name: 'fill'
      },
      stroke: {
        name: 'stroke'
      },
      strokeWidth: {
        name: 'strokeWidth',
        parse: value => scaleSize(value)
      },
      strokeDashArray: {
        name: 'strokeDashArray'
      },
      strokeLineCap: {
        name: 'strokeLineCap'
      },
      opacity: {
        name: 'opacity'
      }
    },
    restrict: ['id', 'shadow']
  };

  return mapObject(prop, mapRules);
};

/**
 * Convert stored image properties to fabric properties
 *
 * @param   {Object}  prop  stored image properties
 * @returns {Object}        fabric properties
 */
export const toFabricImageProp = prop => {
  const mapRules = {
    data: {
      x: {
        name: 'left',
        parse: value => scaleSize(value)
      },
      y: {
        name: 'top',
        parse: value => scaleSize(value)
      },
      color: {
        name: 'fill'
      },
      opacity: {
        name: 'opacity'
      }
    },
    restrict: [
      'id',
      'size',
      'type',
      'textCase',
      'text',
      'border',
      'shadow',
      'flip'
    ]
  };
  return mapObject(prop, mapRules);
};

/**
 * Convert stored text properties to fabric properties
 *
 * @param   {Object}  prop  stored text properties
 * @returns {Object}        fabric properties
 */
export const toFabricBackgroundProp = prop => {
  const mapRules = {
    data: {
      type: {
        name: 'objectType'
      },
      property: {
        restrict: ['type']
      }
    },
    restrict: [
      'id',
      'size',
      'coord',
      'categoryId',
      'name',
      'thumbnail',
      'imageUrl',
      'color',
      'border',
      'shadow',
      'flip'
    ]
  };

  return mapObject(prop, mapRules);
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

export const toFabricClipArtProp = prop => {
  const mapRules = {
    data: {
      x: {
        name: 'left',
        parse: value => scaleSize(value)
      },
      y: {
        name: 'top',
        parse: value => scaleSize(value)
      }
    },
    restrict: ['id', 'size', 'type', 'border', 'shadow', 'flip']
  };
  return mapObject(prop, mapRules);
};

export const getRectDashes = (width, height, value, strokeWidth) => {
  if (value === 'solid') {
    return [];
  }
  const widthArray = getLineDashes(width, 0, 0, 0);
  const heightArray = getLineDashes(0, height, 0, 0);
  const res =
    value === 'round'
      ? [0, scaleSize(strokeWidth * 2), 0, scaleSize(strokeWidth * 2)]
      : [widthArray, 0, heightArray, 0, widthArray, 0, heightArray];
  const dashArray = [].concat.apply([], res);
  return dashArray;
};
// same as previous snippet except that it does return all the segment's dashes
function getLineDashes(x1, y1, x2, y2) {
  const length = Math.hypot(x2 - x1, y2 - y1); // ()
  let dash_length = length / 8;
  const nb_of_dashes = length / dash_length;

  const dash_gap = dash_length * 0.66666;
  dash_length -= dash_gap * 0.3333;

  let total_length = 0;
  const dasharray = [];
  let next;
  while (total_length < length) {
    next = dasharray.length % 2 ? dash_gap : dash_length;
    total_length += next;
    dasharray.push(next);
  }
  return dasharray;
}
