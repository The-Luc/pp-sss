import {
  BackgroundElementObject,
  ClipArtElementObject,
  ImageElementObject,
  ShapeElementObject,
  TextElementObject,
  VideoElementObject
} from '@/common/models/element';

import { DEBOUNCE_PROPERTIES, OBJECT_TYPE } from '@/common/constants';
import { isEmpty } from './util';

/**
 * Computed ratio and return coordinate and dimension of object
 * @param {Object} objCoord - Coordinate of object include x and y
 * @param {Object} objSize - The size of object box include width and height
 * @param {Ref} targetCanvas - Target canvas to draw objects
 * @param {Object} layoutSize - The size of layout  include width and height
 * @return {Object} {left, top, width, height} - Return coordinate and dimension of object after computed ratio
 */
export const computedObjectData = (
  objCoord,
  objSize,
  targetCanvas,
  layoutSize
  // position
) => {
  const { width: canvasWidth, height: canvasHeight } = targetCanvas;
  const { width: layoutWidth, height: layoutHeight } = layoutSize;
  const { x: objectPositionX, y: objectPositionY } = objCoord;
  const { width: objectWidth, height: objectHeight } = objSize;

  const ratioLayoutWidth = canvasWidth / layoutWidth;
  const ratioLayoutHeight = canvasHeight / layoutHeight;
  const centerLeftPoint = (objectWidth / 2) * ratioLayoutWidth;
  const centerTopPoint = (objectHeight / 2) * ratioLayoutHeight;

  let left = objectPositionX * ratioLayoutWidth - centerLeftPoint;
  let top = objectPositionY * ratioLayoutHeight - centerTopPoint;
  const width = objectWidth * ratioLayoutWidth;
  const height = objectHeight * ratioLayoutHeight;
  // if (position === 'right') {// TODO later
  //   // Adjust left position when use select right from single page
  //   left += canvasWidth / 2;
  // }
  return {
    left,
    top,
    width,
    height
  };
};

/**
 * Compute new dimension of object when user input new size data with constrain condition
 * @param {Object} newSize - Dimensional data user input, maybe width|height
 * @param {Object} oldSize - The current/old size of object
 * @param {Number} minSize - The minimum size of object
 * @param {Number} maxSize - The maximum size of object
 * @param {Boolean} isConstrain - The object is constrain mode or not
 * @return {Object} {width, height} - Return new size of object after calculated
 */
export const computedObjectSize = (
  newSize,
  oldSize,
  minSize,
  maxSize,
  isConstrain
) => {
  if (!isConstrain) return { ...oldSize, ...newSize };

  const key = Object.keys(newSize)[0];
  const ratio = newSize[key] / oldSize[key];
  const dimensional = key === 'width' ? 'height' : 'width';
  const newValue = oldSize[dimensional] * ratio;
  const maxValue = newValue > maxSize ? maxSize : newValue;

  const dimensionalValue = newValue < minSize ? minSize : maxValue;

  return { ...oldSize, ...newSize, [dimensional]: dimensionalValue };
};

/**
 * To create an object with new values as [prefix]/[value]
 * @param {Object} obj - the object to be converted
 * @param {String} prefix - the string to add before every obj's value
 * @param {String} separator - Default: "/" - the separator to add between prefix and value
 */
export const prefixObjectValue = (obj, prefix, separator = '/') => {
  return Object.keys(obj).reduce(
    (arr, key) => ({
      ...arr,
      [key]: [prefix, obj[key]].join(separator)
    }),
    {}
  );
};

/**
 * Convert entity to object
 *
 * @param   {Object}  entity  entity to convert
 * @returns {Object}          object convert from entity
 */
export const entityToObject = entity => {
  if (entity.type === OBJECT_TYPE.BACKGROUND) {
    return new BackgroundElementObject(entity);
  }

  if (entity.type === OBJECT_TYPE.TEXT) {
    return new TextElementObject(entity);
  }

  if (entity.type === OBJECT_TYPE.CLIP_ART) {
    return new ClipArtElementObject(entity);
  }

  if (entity.type === OBJECT_TYPE.SHAPE) {
    return new ShapeElementObject(entity);
  }

  if (entity.type === OBJECT_TYPE.IMAGE) {
    return new ImageElementObject(entity);
  }

  if (entity.type === OBJECT_TYPE.VIDEO) {
    return new VideoElementObject(entity);
  }

  return null;
};

/**
 * Convert list of entity to list of object
 *
 * @param   {Array} entity  entities to convert
 * @returns {Array}         objects convert from entities
 */
export const entitiesToObjects = entities => {
  return entities.map(entity => entityToObject(entity)).filter(Boolean);
};

/**
 * Check if video is playing
 *
 * @param   {Object}  video video to check
 * @returns {Boolean}       is video playing
 */
export const isVideoPlaying = video => {
  const isPlaying = video.get('isPlaying');

  return isEmpty(isPlaying) ? false : isPlaying;
};

/**
 * Check if prop contain debounce data
 *
 * @param   {Object}  prop  prop to check
 * @returns {Boolean}       is contain
 */
export const isContainDebounceProp = prop => {
  return DEBOUNCE_PROPERTIES.some(p => !isEmpty(prop[p]));
};

/**
 * Get order options from order
 *
 * @param   {Array} objects order list
 * @returns {Array}         options
 */
export const getOrdeOptions = objects => {
  return Object.values(objects)
    .filter(obj => obj?.type && obj.type !== OBJECT_TYPE.BACKGROUND)
    .map((_, i) => ({
      name: i + 1,
      value: i + 1
    }));
};
