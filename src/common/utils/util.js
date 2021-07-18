import { cloneDeep, merge, intersection } from 'lodash';

import { BORDER_STYLES, CANVAS_BORDER_TYPE, STATUS } from '@/common/constants';
import { scaleSize } from './canvas';

export let activeCanvas = null;

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
 * Merge 2 arrays without duplicate
 *
 * @param   {Array} array1  first array to merge
 * @param   {Array} array2  second array to merge
 * @returns {Array}         after merge array
 */
export const mergeArray = (array1, array2) => {
  return intersection([...array1, ...array2]);
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
      const isNoSubRule = isEmpty(rules.data[k]);
      const isNoSubRuleData = isNoSubRule || isEmpty(rules.data[k].data);
      const isNoSubRuleRestrict =
        isNoSubRule || isEmpty(rules.data[k].restrict);

      const subData = isNoSubRuleData ? {} : rules.data[k].data;
      const subRestrict = isNoSubRuleRestrict ? [] : rules.data[k].restrict;

      const useRules = cloneDeep(rules);

      merge(useRules, subData);

      useRules.restrict = mergeArray(useRules.restrict, subRestrict);

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

export const getRectDashes = (width, height, strokeType, strokeWidth) => {
  if (!strokeWidth) {
    return [];
  }
  let dashArray = [];
  if (strokeType === BORDER_STYLES.ROUND) {
    dashArray = getRoundDashes(width, height, strokeWidth);
  } else if (strokeType === BORDER_STYLES.SQUARE) {
    const widthArray = getLineDashes(width, 0, 0, 0);
    const heightArray = getLineDashes(0, height, 0, 0);
    dashArray = [widthArray, 0, heightArray, 0, widthArray, 0, heightArray];
  }
  return [].concat(...dashArray);
};

/**
 * Calculate points of rounded border
 *
 * @param   {Number}  width  Width of element
 * @param   {Number}  height  Height of element
 */
const getRoundDashes = (width, height, strokeWidth) => {
  const clientStrokeWidth = strokeWidth || 1;

  const clientWidth = width - clientStrokeWidth; //real width include stroke
  const clientHeight = height - clientStrokeWidth; //real height include stroke

  const pointsOfWidth = Math.round(clientWidth / (clientStrokeWidth * 2)); //Width points
  const pointsOfHeight = Math.round(clientHeight / (clientStrokeWidth * 2)); //Height points

  const widthDashTemplate = [0, clientWidth / pointsOfWidth];
  const heightDashTemplate = [0, clientHeight / pointsOfHeight];

  const calcDashArray = (points, dashTemplate) => {
    return Array.from({ length: points - 1 }).reduce(arr => {
      arr.push(...dashTemplate);
      return arr;
    }, []);
  };

  return Array.from({ length: 4 }, (_, index) => {
    if (index % 2) {
      return calcDashArray(pointsOfHeight, heightDashTemplate);
    }
    return calcDashArray(pointsOfWidth, widthDashTemplate);
  });
};

// same as previous snippet except that it does return all the segment's dashes
export const getLineDashes = (x1, y1, x2, y2) => {
  const length = Math.hypot(x2 - x1, y2 - y1); // ()
  let dash_length = length / 8;

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
};

export const getStrokeLineCap = strokeType => {
  if ([BORDER_STYLES.ROUND, BORDER_STYLES.SQUARE].indexOf(strokeType) !== -1) {
    return strokeType;
  }
  return CANVAS_BORDER_TYPE.BUTT;
};

/**
 * Get border data from store and set to Rect object
 */
export const setBorderObject = (rectObj, objectData) => {
  const {
    border: { strokeWidth, stroke, strokeLineType }
  } = objectData;

  const strokeLineCap = getStrokeLineCap(strokeLineType);

  rectObj.set({
    strokeWidth: scaleSize(strokeWidth),
    stroke,
    strokeLineCap,
    strokeLineType
  });

  setTimeout(() => {
    rectObj.canvas.renderAll();
  });
};

/**
 * Set border color when selected group object
 * @param {Element}  group  Group object
 * @param {Object}  sheetLayout  current layout of canvas
 */
export const setBorderHighLight = (group, sheetLayout) => {
  group.set({
    borderColor: sheetLayout?.id ? 'white' : '#bcbec0'
  });
};

/**
 * Set canvas uniform scaling (constrain proportions)
 * @param {Element} canvas Reference to fabric canvas
 * @param {Boolean}  isConstrain  Constrain mode of object
 */
export const setCanvasUniformScaling = (canvas, isConstrain) => {
  canvas.set({
    uniformScaling: isConstrain
  });
};

/**
 * Set current canvas is focused
 */
export const setActiveCanvas = canvas => (activeCanvas = canvas);

/**
 * Compare 2 item by id
 *
 * @param   {Oject} item1 first item to compare
 * @param   {Oject} item2 second item to compare
 * @returns {Number}      compare result (-1: smaller, 1: bigger)
 */
export const compareByValue = (item1, item2) => {
  return item1.value < item2.value ? -1 : 1;
};

/**
 * Check if status is ok
 *
 * @param   {Number}  status  status to check
 * @returns {Boolean}         status is ok or not
 */
export const isOk = ({ status }) => {
  return status === STATUS.OK;
};

/**
 * Move item to new position
 *
 * @param   {Any}     item          item to move, can be any type
 * @param   {Number}  currentIndex  current index of item
 * @param   {Number}  moveToIndex   index to move
 * @param   {Array}   items         list of item contain item to be moved
 * @returns {Array}                 list of item after item moved
 */
export const moveItem = (item, currentIndex, moveToIndex, items) => {
  const _items = [...items];

  if (moveToIndex < currentIndex) {
    _items.splice(currentIndex, 1);
    _items.splice(moveToIndex, 0, item);
  } else if (moveToIndex > currentIndex) {
    _items.splice(moveToIndex + 1, 0, item);
    _items.splice(currentIndex, 1);
  }

  return _items;
};

/**
 * Get display info
 *
 * @param   {String}  name        name of info
 * @param   {String}  description description of info
 * @returns {Object}              display info
 */
export const getDisplayInfo = (name, description, customClass) => {
  return {
    name: `${name}:`,
    description: isEmpty(description) ? '' : description,
    ...{ customClass }
  };
};
