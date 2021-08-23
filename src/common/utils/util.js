import { cloneDeep, merge, intersection, uniqueId } from 'lodash';

import { STATUS } from '@/common/constants';

export let activeCanvas = null;

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

    if (Array.isArray(sourceObject[k]) || sourceObject[k] === null) {
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

/**
 * Remove items form array
 *
 * @param   {Array}   originalItems list of item need to be change
 * @param   {Array}   items         items needs to be removed {index, value}
 * @returns {Array}                 list of item after changed
 */
export const removeItemsFormArray = (originalItems, items) => {
  const _items = cloneDeep(originalItems);

  return _items.filter((item, index) => {
    const removeItem = items.find(rItem => {
      if (!isEmpty(rItem.index)) return index === rItem.index;

      return JSON.stringify(item) === JSON.stringify(rItem.value);
    });

    return isEmpty(removeItem);
  });
};

/**
 * Insert items to array
 *
 * @param   {Array}   originalItems list of item need to be change
 * @param   {Array}   items         items needs to be add {index, value}
 * @returns {Array}                 list of item after changed
 */
export const insertItemsToArray = (originalItems, items) => {
  const _items = cloneDeep(originalItems);

  _items.sort((i1, i2) => (i1?.index > i2?.index ? -1 : 1));

  items.forEach(item => {
    const isAddToLast = isEmpty(item.index) || item.index < 0;

    const addIndex = isAddToLast ? _items.length : item.index;

    _items.splice(addIndex, 0, item.value);
  });

  return _items;
};

/**
 * Modify items in array
 *
 * @param   {Array}   originalItems list of item need to be change
 * @param   {Array}   items         items needs to be changed {index, value}
 * @returns {Array}                 list of item after changed
 */
export const modifyItemsInArray = (originalItems, items) => {
  const _items = cloneDeep(originalItems);

  items.forEach(item => (_items[item.index] = item.value));

  return _items;
};

/**
 * Remove items form object
 *
 * @param   {Object}  originalItems list of item need to be change
 * @param   {Array}   items         items needs to be removed {key, value}
 * @returns {Object}                list of item after changed
 */
export const removeItemsFormObject = (originalItems, items) => {
  const _items = cloneDeep(originalItems);

  items.forEach(item => {
    if (!isEmpty(item.key)) {
      delete _items[item.key];

      return;
    }

    const key = Object.keys(_items).find(k => {
      return JSON.stringify(_items[k]) === JSON.stringify(item.value);
    });

    if (!isEmpty(key)) delete _items[key];
  });

  return _items;
};

/**
 * Insert items to object
 *
 * @param   {Object}  originalItems list of item need to be change
 * @param   {Array}   items         items needs to be add {key, value}
 * @returns {Object}                list of item after changed
 */
export const insertItemsToObject = (originalItems, items) => {
  const _items = cloneDeep(originalItems);

  items.forEach(item => {
    if (!hasOwnProperty(_items, item.key)) _items[item.key] = item.value;
  });

  return _items;
};

/**
 * Modify items in object
 *
 * @param   {Object}  originalItems list of item need to be change
 * @param   {Array}   items         items needs to be changed {index, value}
 * @returns {Object}                list of item after changed
 */
export const modifyItemsInObject = (originalItems, items) => {
  const _items = cloneDeep(originalItems);

  items.forEach(item => {
    if (hasOwnProperty(_items, item.key)) _items[item.key] = item.value;
  });

  return _items;
};

/**
 * Check if object has selected prop
 *
 * @param   {Object}  object  object need to check
 * @param   {String}  prop    property name
 * @returns {Boolean}         return object has selected prop or not
 */
export const hasOwnProperty = (object, prop) => {
  return Object.prototype.hasOwnProperty.call(object, prop);
};

/**
 * Get file extension
 *
 * @param   {String}  fileName file name
 * @returns {String}  file type
 */
export const getFileExtension = fileName => {
  const result = /[.]/.exec(fileName) ? /[^.]+$/.exec(fileName) : [''];

  return `.${result[0].toLowerCase()}`;
};

/**
 * Get unique id
 *
 * @returns {Number}  new id
 */
export const getUniqueId = () => {
  return uniqueId();
};
