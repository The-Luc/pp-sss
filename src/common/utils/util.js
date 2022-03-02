import { cloneDeep, merge, intersection, differenceWith } from 'lodash';

import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

import { inToPx, ptToPx, getPagePrintSize } from './canvas';
import { getDiffDaysFOMToEOM } from './time';

import {
  STATUS,
  DIGITAL_CANVAS_SIZE,
  PRINT_CANVAS_SIZE,
  DIGITAL_PAGE_SIZE,
  DATE_FORMAT,
  THUMBNAIL_IMAGE_CONFIG,
  OBJECT_TYPE
} from '@/common/constants';
import Color from 'color';
import { BaseShadow } from '../models/element';
import { fabric } from 'fabric';

import {
  createBackgroundFabricObject,
  createClipartObject,
  createMediaObject,
  createPortraitImageObject,
  createSvgObject,
  createTextBoxObject
} from '@/common/fabricObjects';

const mapSubData = (sourceObject, rules, data) => {
  const isNoSubRule = isEmpty(data);
  const isNoSubRuleData = isNoSubRule || isEmpty(data.data);
  const isNoSubRuleRestrict = isNoSubRule || isEmpty(data.restrict);

  const subData = isNoSubRuleData ? {} : data.data;
  const subRestrict = isNoSubRuleRestrict ? [] : data.restrict;

  const useRules = cloneDeep(rules);

  merge(useRules.data, subData);

  useRules.restrict = mergeArray(useRules.restrict, subRestrict);

  return mapObject(sourceObject, useRules);
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
    try {
      return JSON.stringify(obj) === JSON.stringify({});
    } catch {
      return false;
    }
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
 * Merge 2 arrays without duplicate & empty
 *
 * @param   {Array} array1  first array to merge
 * @param   {Array} array2  second array to merge
 * @returns {Array}         after merge array
 */
export const mergeArrayNonEmpty = (array1, array2) => {
  return intersection([...array1, ...array2]).filter(item => !isEmpty(item));
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

    const isForceMap = !isEmpty(rules.data[k]) && rules.data[k].isForce;

    if (
      Array.isArray(sourceObject[k]) ||
      (!isForceMap && sourceObject[k] === null)
    ) {
      resultObject[k] = sourceObject[k];

      return;
    }

    const isMappingSub =
      typeof sourceObject[k] === 'object' &&
      sourceObject[k] !== null &&
      !rules.data[k]?.noSub;

    if (isMappingSub) {
      merge(resultObject, mapSubData(sourceObject[k], rules, rules.data[k]));

      return;
    }

    if (isEmpty(rules.data[k])) {
      resultObject[k] = sourceObject[k];

      return;
    }

    const mapName = rules.data[k].name;

    if (isEmpty(rules.data[k].parse)) {
      resultObject[mapName] = sourceObject[k];

      return;
    }

    const sourceName = rules.data[k].source;

    const originValue = isEmpty(sourceName)
      ? sourceObject[k]
      : sourceObject[sourceName];

    const value = rules.data[k].parse(originValue);

    resultObject[mapName] = isEmpty(resultObject[mapName])
      ? value
      : merge(resultObject[mapName], value);
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
 * @param   {Object || Array}  res response data
 * @returns {Boolean}         status is ok or not
 */
export const isOk = res => {
  if (!Array.isArray(res)) return res.status === STATUS.OK;

  return res.every(r => r.status === STATUS.OK);
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

  items.sort((i1, i2) => (i1?.index > i2?.index ? -1 : 1));

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
  return uuidv4();
};

/**
 * Get different of arrays
 *
 * @param   {Array}     arr1      first array
 * @param   {Array}     arr2      second array
 * @param   {Function}  compareFn compare method
 * @returns {Array}               result
 */
export const getDiffBetweenArray = (arr1, arr2, compareFn) => {
  return differenceWith(
    arr1.length >= arr2.length ? arr1 : arr2,
    arr1.length <= arr2.length ? arr1 : arr2,
    compareFn
  );
};

/**
 * Get boolean from nullable boolean
 *
 * @param   {Boolean} value nullable boolean
 * @returns {Boolean}       boolean value
 */
export const getBoolean = value => {
  return isEmpty(value) ? false : value;
};

/**
 * Convert pt to px for preview portrait flow
 *
 * @param   {Number}  val - the pt value that need to be converted
 * @returns {Number}  the result px
 */
export const ptToPxPreview = (value, previewHeight, isDigital = false) => {
  const canvasHeight = isDigital
    ? DIGITAL_CANVAS_SIZE.HEIGHT
    : getPagePrintSize().pixels.pageHeight;

  const ratio = canvasHeight / previewHeight;

  return ptToPx(value) / ratio;
};

/**
 * Convert in to px for preview portrait flow
 *
 * @param   {Number}  val - the in value that need to be converted
 * @returns {Number}  the result px
 */
export const inToPxPreview = (value, previewHeight, isDigital = false) => {
  const canvasHeight = isDigital
    ? DIGITAL_CANVAS_SIZE.HEIGHT
    : getPagePrintSize().pixels.pageHeight;

  const ratio = canvasHeight / previewHeight;

  return inToPx(value) / ratio;
};

/**
 * Get element from selected ref
 *
 * @param   {Object}  refs  current refs
 * @param   {String}  refId ref id of selected ref
 * @returns {Object}        element get from selected ref
 */
export const getRefElement = (refs, refId) => {
  if (isEmpty(refs) || isEmpty(refs[refId])) return null;

  const object = isEmpty(refs[refId].length) ? refs[refId] : refs[refId][0];

  return isEmpty(object?.$el) ? object : object.$el;
};

/**
 * Auto scroll to element
 *
 * @param {Object}  refs      current refs
 * @param {String}  refId     ref id of target element
 * @param {String}  blockType type of block
 */
export const autoScroll = (
  refs,
  refId,
  parentContainer = null,
  blockType = 'center'
) => {
  setTimeout(() => {
    const element = getRefElement(refs, refId);

    if (isEmpty(element)) {
      if (!isEmpty(parentContainer)) parentContainer.scrollTop = 0;

      return;
    }

    const block = isEmpty(blockType) ? {} : { block: blockType };

    scrollToElement(element, block);
  }, 20);
};

export const getPageSize = isDigital => {
  const digitalPageSize = {
    safeMargin: 0,
    pageWidth: DIGITAL_PAGE_SIZE.PDF_WIDTH,
    pageHeight: DIGITAL_PAGE_SIZE.PDF_HEIGHT,
    bleedLeft: 0,
    bleedTop: 0
  };

  return isDigital ? digitalPageSize : getPagePrintSize().inches;
};

/**
 * Stop the execution and wait for the provided duration
 * @param {Number} mili milisecond
 * @returns {Promise}
 */
export const waitMiliseconds = mili => {
  return new Promise(r => setTimeout(r, mili));
};

/**
 * Get unique color from base color
 *
 * @param   {Array}   baseColors    base color list
 * @param   {Array}   currentColors current color list
 * @returns {String}                unique color
 */
export const getUniqueColor = (baseColors, currentColors) => {
  const availableColors = baseColors.filter(color => {
    return !currentColors.includes(color);
  });

  const randomNumber = Math.floor(Math.random() * availableColors.length + 1);

  return availableColors[randomNumber - 1];
};

/**
 * Get with by time
 *
 * @param   {String}  beginDate       the begining date
 * @param   {Number}  plusMonth       total month will be added to begin date
 * @param   {Number}  totalTimeInDay  total time to calculate in day
 * @returns {String}                  width in %
 */
export const getWidthOfGanttTimeline = (
  beginDate,
  plusMonth,
  totalTimeInDay
) => {
  const currentTime = moment(beginDate, DATE_FORMAT.BASE).add(plusMonth, 'M');

  const totalDays = getDiffDaysFOMToEOM(
    currentTime.format(DATE_FORMAT.BASE),
    currentTime.format(DATE_FORMAT.BASE)
  );

  return (totalDays / totalTimeInDay) * 100;
};

/**
 * To convert color object to hex code
 *
 * @param {Object} colorObject color object : e.g. {red: 255, green: 255, blue: 255}
 * @returns  {String} hex code of the color
 */
export const convertAPIColorObjectToHex = colorObject => {
  const { red: r, blue: b, green: g, alpha } = colorObject;
  return Color({ r, g, b })
    .alpha(alpha)
    .hex();
};

/**
 * To convert rgb color to hex color, alpha channel will be discarded
 *
 * @param {String} rgb rgb color e.g. rgb(234, 41, 41) or rgba(234, 41, 41,0.3)
 * @returns hex value of color
 */
export const convertRGBToHex = rgb => {
  return Color(rgb).hex();
};

/**
 *  To convert shadow object get from API to fronted shadow object
 * @param {Object} apiShadow shadow object from API
 * @returns {Object} standard shadow object used in frontend
 */
export const parseFromAPIShadow = apiShadow => {
  const shadowColor = convertAPIColorObjectToHex(apiShadow.color);

  const { h_shadow: x, v_shadow: y } = apiShadow;
  const dropShadow = x > 0 || y > 0;
  const shadowAngle = (Math.atan2(y, x) * 180) / Math.PI - 90;
  const shadowOffset = Math.sqrt(x * x + y * y);

  return new BaseShadow({ dropShadow, shadowOffset, shadowAngle, shadowColor });
};

/**
 * To split base 64 image into two half
 *
 * @param {String} imgUrl base 64 image url
 * @returns 2 base 64 image url
 */
export const splitBase64Image = async imgUrl => {
  const img = await new Promise(r => {
    fabric.Image.fromURL(imgUrl, image => r(image), {
      crossOrigin: 'anonymous'
    });
  });

  const el = fabric.util.createCanvasElement();
  const width = img.width;
  const halfWidth = Math.floor(width / 2);
  el.width = width;
  el.height = img.height;

  const canvas = new fabric.StaticCanvas(el, {
    enableRetinaScaling: false,
    renderOnAddRemove: false,
    skipOffscreen: false
  });
  canvas.add(img);

  const getThumb = (canvasObj, left, cropWidth) =>
    canvasObj.toDataURL({
      quality: THUMBNAIL_IMAGE_CONFIG.QUALITY,
      format: THUMBNAIL_IMAGE_CONFIG.FORMAT,
      multiplier: THUMBNAIL_IMAGE_CONFIG.MULTIPLIER,
      left,
      width: cropWidth
    });

  const leftThumb = getThumb(canvas, 0, halfWidth);
  const rightThumb = getThumb(canvas, halfWidth, halfWidth);

  canvas._objects = [];
  canvas.dispose();

  return { leftThumb, rightThumb };
};

export const generateCanvasThumbnail = async (objects, isDigital) => {
  if (isEmpty(objects)) return '';

  const EDITOR_SIZE = isDigital ? DIGITAL_CANVAS_SIZE : PRINT_CANVAS_SIZE;

  const el = fabric.util.createCanvasElement();
  el.width = isDigital ? EDITOR_SIZE.WIDTH : Math.ceil(EDITOR_SIZE.WIDTH / 2);
  el.height = EDITOR_SIZE.HEIGHT;

  const canvas = new fabric.StaticCanvas(el, {
    enableRetinaScaling: false,
    renderOnAddRemove: false,
    skipOffscreen: false,
    backgroundColor: '#fff',
    evented: false
  });

  await drawObjectsOnCanvas(objects, canvas);

  const thumb = canvas.toDataURL({
    quality: THUMBNAIL_IMAGE_CONFIG.QUALITY,
    format: THUMBNAIL_IMAGE_CONFIG.FORMAT,
    multiplier: THUMBNAIL_IMAGE_CONFIG.MULTIPLIER
  });

  canvas._objects = [];
  canvas.dispose();

  return thumb || '';
};

/**
 * Draw objects on canvas
 *
 * @param {Array}   objects list of object of current frame
 * @param {Object}  canvas  canvas is used to draw objects into
 */
export const drawObjectsOnCanvas = async (objects, canvas) => {
  const drawObjectMethods = {
    [OBJECT_TYPE.BACKGROUND]: createBackgroundFabricObject,
    [OBJECT_TYPE.TEXT]: text => createTextBoxObject(text).object,
    [OBJECT_TYPE.SHAPE]: createSvgObject,
    [OBJECT_TYPE.CLIP_ART]: createClipartObject,
    [OBJECT_TYPE.IMAGE]: createMediaObject,
    [OBJECT_TYPE.VIDEO]: createMediaObject,
    [OBJECT_TYPE.PORTRAIT_IMAGE]: createPortraitImageObject
  };

  const drawObjectPromises = objects.map(obj => {
    return drawObjectMethods[obj.type](obj, canvas);
  });

  const fabricObjects = await Promise.all(drawObjectPromises);

  canvas.add(...fabricObjects);
};

/**
 * To sort an array based on sortedBy property
 * @param {Array} arr array of item will be sorted
 * @param {String} sortedBy item property`
 * @returns sorted array
 */
export const sortByProperty = (arr, sortedBy) => {
  return cloneDeep(arr).sort(
    (a, b) => Number(a[sortedBy]) - Number(b[sortedBy])
  );
};

/**
 *  To get different element of array a compared to array b
 *  including duplicate elements
 * ex: a = [1, 2, 3], b = [1, 2] => res = [3]
 * ex: a = [2, 2, 3], b = [1, 2] => res = [2, 3]
 * ex: a = [2, 2], b = [1, 2, 3] => res = [2]
 *
 * @param {Array} a array a
 * @param {Array} b  array b
 * @returns  Array
 */
export const arrayDifference = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b)) return;

  const tmpB = cloneDeep(b);

  return a.filter(el => {
    const index = tmpB.indexOf(el);

    if (index < 0) return true;

    tmpB.splice(index, 1);
    return false;
  });
};

/**
 *  To check whether two arrays are equal
 *
 * @param {String} a a string to compare
 * @param {String} b a string to compare
 * @returns is the two string equal
 */
export const isEqualString = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return;

  return a.toLowerCase() === b.toLowerCase();
};
