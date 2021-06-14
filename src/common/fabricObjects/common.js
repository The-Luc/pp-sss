import { OBJECT_TYPE } from '@/common/constants';

import { cloneDeep, merge } from 'lodash';
import { isEmpty, mapObject, scaleSize, mergeArray } from '@/common/utils';

const DEFAULT_RULE_DATA = {
  TYPE: {
    name: 'objectType'
  },
  X: {
    name: 'left',
    parse: value => scaleSize(value)
  },
  Y: {
    name: 'top',
    parse: value => scaleSize(value)
  },
  ROTATION: {
    name: 'angle'
  },
  COLOR: {
    name: 'fill'
  },
  HORIZIONTAL: {
    name: 'flipX'
  },
  VERTICAL: {
    name: 'flipY'
  }
};

const DEFAULT_RULE_RESTRICT = ['id', 'name'];

const NORMAL_RULES = {
  data: {
    type: DEFAULT_RULE_DATA.TYPE
  },
  restrict: DEFAULT_RULE_RESTRICT
};

/**
 * Convert stored properties to fabric properties
 *
 * @param   {Object}  prop  stored properties
 * @returns {Object}        fabric properties
 */
export const toFabricBackgroundProp = prop => {
  const mapRules = {
    data: {
      type: DEFAULT_RULE_DATA.TYPE,
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
 * Convert stored properties to fabric properties
 *
 * @param   {Object}  prop  stored properties
 * @returns {Object}        fabric properties
 */
export const toFabricShapeProp = prop => {
  const mapRules = {
    data: {
      type: DEFAULT_RULE_DATA.TYPE,
      x: DEFAULT_RULE_DATA.X,
      y: DEFAULT_RULE_DATA.Y,
      rotation: DEFAULT_RULE_DATA.ROTATION,
      color: DEFAULT_RULE_DATA.COLOR,
      horiziontal: DEFAULT_RULE_DATA.HORIZIONTAL,
      vertical: DEFAULT_RULE_DATA.VERTICAL
    },
    restrict: ['id', 'name', 'thumbnail', 'pathData', 'border', 'shadow']
  };

  return mapObject(prop, mapRules);
};

/**
 * Get fabric property base on element type from property
 *
 * @param   {String}  elementType   the type of selected element
 * @param   {Object}  prop          new property
 * @returns {Object}                fabric property
 */
const getFabricProp = (elementType, prop) => {
  if (elementType === OBJECT_TYPE.BACKGROUND) {
    return toFabricBackgroundProp(prop);
  }

  if (elementType === OBJECT_TYPE.SHAPE) {
    return toFabricShapeProp(prop);
  }

  return {};
};

/**
 * Change property of element
 *
 * @param {Object}  element the element will be change property
 * @param {Object}  prop    new property
 * @param {Object}  canvas  the canvas contain element
 */
export const updateElement = (element, prop, canvas) => {
  if (isEmpty(element) || isEmpty(prop)) return;

  const fabricProp = getFabricProp(element.objectType, prop);

  Object.keys(fabricProp).forEach(k => {
    element.set(k, fabricProp[k]);
  });

  canvas.renderAll();
};
