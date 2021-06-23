import { fabric } from 'fabric';

import { OBJECT_TYPE } from '@/common/constants';

import { inToPx, isEmpty, mapObject, scaleSize } from '@/common/utils';

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

// TODO use later
/* const DEFAULT_RULE_RESTRICT = ['id', 'name'];

const NORMAL_RULES = {
  data: {
    type: DEFAULT_RULE_DATA.TYPE
  },
  restrict: DEFAULT_RULE_RESTRICT
}; */

/**
 * Convert stored properties to fabric properties
 *
 * @param   {Object}  prop  stored properties
 * @returns {Object}        fabric properties
 */
export const toFabricBackgroundProp = prop => {
  const mapRules = {
    data: {
      type: DEFAULT_RULE_DATA.TYPE
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
      'flip',
      'backgroundType'
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
export const toFabricShapeProp = (prop, originalElement) => {
  const mapRules = {
    data: {
      type: DEFAULT_RULE_DATA.TYPE,
      x: {
        name: 'left',
        parse: value => inToPx(value)
      },
      y: {
        name: 'top',
        parse: value => inToPx(value)
      },
      rotation: DEFAULT_RULE_DATA.ROTATION,
      color: DEFAULT_RULE_DATA.COLOR,
      horiziontal: DEFAULT_RULE_DATA.HORIZIONTAL,
      vertical: DEFAULT_RULE_DATA.VERTICAL,
      width: {
        name: 'scaleX',
        parse: value => {
          if (originalElement) {
            return inToPx(value) / originalElement.width;
          }
          return 1;
        }
      },
      height: {
        name: 'scaleY',
        parse: value => {
          if (originalElement) {
            return inToPx(value) / originalElement.height;
          }
          return 1;
        }
      }
    },
    restrict: ['id', 'name', 'thumbnail', 'pathData', 'border', 'shadow']
  };

  return mapObject(prop, mapRules);
};

/**
 * Convert stored properties to fabric properties
 *
 * @param   {Object}  prop  stored properties
 * @returns {Object}        fabric properties
 */
export const toFabricClipArtProp = (prop, originalElement) => {
  const mapRules = {
    data: {
      type: DEFAULT_RULE_DATA.TYPE,
      x: {
        name: 'left',
        parse: value => inToPx(value)
      },
      y: {
        name: 'top',
        parse: value => inToPx(value)
      },
      width: {
        name: 'scaleX',
        parse: value => {
          if (originalElement) {
            return inToPx(value) / originalElement.width;
          }
          return 1;
        }
      },
      height: {
        name: 'scaleY',
        parse: value => {
          if (originalElement) {
            return inToPx(value) / originalElement.height;
          }
          return 1;
        }
      },
      rotation: DEFAULT_RULE_DATA.ROTATION,
      color: DEFAULT_RULE_DATA.COLOR,
      horiziontal: DEFAULT_RULE_DATA.HORIZIONTAL,
      vertical: DEFAULT_RULE_DATA.VERTICAL
    },
    restrict: ['id', 'name', 'thumbnail', 'border', 'shadow']
  };

  return mapObject(prop, mapRules);
};

/**
 * Get fabric property base on element type
 *
 * @param   {String}  elementType   the type of selected element
 * @param   {Object}  prop          new property
 * @param   {Object}  element       new property
 * @returns {Object}                fabric property
 */
const getFabricPropByType = (elementType, prop, element) => {
  if (elementType === OBJECT_TYPE.BACKGROUND) {
    return toFabricBackgroundProp(prop);
  }
  if (elementType === OBJECT_TYPE.SHAPE) {
    return toFabricShapeProp(prop, element);
  }

  if (elementType === OBJECT_TYPE.CLIP_ART) {
    return toFabricClipArtProp(prop, element);
  }

  return {};
};

/**
 * Get fabric property base on element type from property
 *
 * @param   {String}  elementType   the type of selected element
 * @param   {Object}  prop          new property
 * @returns {Object}                fabric property
 */
const getFabricProp = (element, prop) => {
  return getFabricPropByType(element.objectType, prop, element);
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

  const fabricProp = getFabricProp(element, prop);

  setElementProp(element, fabricProp);

  if (Object.keys(prop).includes('isConstrain')) {
    canvas.set({ uniformScaling: prop.isConstrain });
  }

  canvas.renderAll();
};

/**
 * Update element property (include group)
 *
 * @param {Object}  element the selected element
 * @param {Object}  prop    new property
 */
export const setElementProp = (element, prop) => {
  element.set(prop);

  const key = Object.keys(prop);

  const isSvgEl =
    element?.objectType === OBJECT_TYPE.SHAPE ||
    element?.objectType === OBJECT_TYPE.CLIP_ART;
  const isModifySize = ['scaleX', 'scaleY'].includes(key[0]);
  const isModifyRotate = ['angle'].includes(key[0]);
  const isModifyPosition = ['top', 'left'].includes(key[0]);

  if (element.getObjects) {
    if ((isSvgEl && (isModifySize || isModifyPosition)) || isModifyRotate)
      return;

    element.getObjects().forEach(o => o.set(prop));
  }
};

/**
 * Move the element to the center of the page
 *
 * @param {Object}  element             the element will be change property
 * @param {Boolean} isAddedToSinglePage is container a single page
 * @param {Boolean} isPlaceInLeftPage   is place in left single page
 */
export const moveToCenterPage = (
  element,
  isAddedToSinglePage = false,
  isPlaceInLeftPage = false
) => {
  element.viewportCenter().setCoords();

  if (!isAddedToSinglePage) return;

  const ratio = isPlaceInLeftPage ? 0.5 : 1.5;

  element.set('left', element.get('left') * ratio).setCoords();
};

/**
 * Get svg data
 *
 * @param   {String}  svgUrl          the url of svg file
 * @param   {Object}  elementProperty the fabric property of element
 * @param   {Number}  expectedHeight  the view height of svg element
 * @returns {Object}                  the svg data
 */
export const getSvgData = (svgUrl, elementProperty, expectedHeight) => {
  return new Promise(resolve => {
    fabric.loadSVGFromURL(svgUrl, (objects, options) => {
      const svg = fabric.util.groupSVGElements(objects, options);
      const scale = inToPx(expectedHeight) / svg.height;

      svg.set({
        ...elementProperty,
        width: svg.width,
        height: svg.height,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale
      });

      if (!svg.isColorful) {
        const { fill } = svg;

        setElementProp(svg, { fill, stroke: fill });
      }

      resolve(svg);
    });
  });
};

/**
 * Adding svg element to canvas
 *
 * @param {Object}  svg              svg data of will be added element
 * @param {Object}  canvas           the canvas contain new element
 */
export const addSingleSvg = (
  svg,
  canvas,
  isAddedToSinglePage,
  isPlaceInLeftPage
) => {
  canvas.add(svg);

  canvas.bringToFront(svg);

  moveToCenterPage(svg, isAddedToSinglePage, isPlaceInLeftPage);
};

/**
 * Adding svg elements to canvas
 *
 * @param {Array}   svgs            list of svg data of will be added element
 * @param {Object}  canvas          the canvas contain new element
 */
export const addMultiSvg = (
  svgs,
  canvas,
  isAddedToSinglePage,
  isPlaceInLeftPage
) => {
  let left = 0;

  svgs.forEach(s => {
    s.set({ left });

    left += scaleSize(11) + s.width * s.scaleX;
  });

  const group = new fabric.Group(svgs, {
    originX: 'center',
    originY: 'center'
  });

  group.setCoords();

  canvas.add(group);

  moveToCenterPage(group, isAddedToSinglePage, isPlaceInLeftPage);

  group.getObjects().forEach(item => {
    canvas.add(item);

    canvas.bringToFront(item);
  });

  group.destroy();

  canvas.remove(group);
};

/**
 * Adding event listener to element
 *
 * @param {Object}  element         element will be added event
 * @param {Object}  eventListeners  event list {name, eventHandling}
 */
export const addEventListeners = (element, eventListeners) => {
  Object.keys(eventListeners).forEach(k => {
    element.on(k, eventListeners[k]);
  });
};

/**
 * Adding svgs to canvas
 *
 * @param {Array}   svgObjects          list of sgv will be added
 * @param {String}  svgUrlAttrName      the attribute name contain svg url
 * @param {Nunber}  expectedHeight      the attribute name contain svg url
 * @param {Object}  canvas              the canvas contain new sgv
 * @param {Boolean} isAddedToSinglePage is sgv will be added to single page
 * @param {Boolean} isPlaceInLeftPage   is sgv will be added to left page
 * @param {Object}  eventListeners      sgv event list {name, eventHandling}
 */
export const addPrintSvgs = async (
  svgObjects,
  svgUrlAttrName,
  expectedHeight,
  canvas,
  isAddedToSinglePage,
  isPlaceInLeftPage,
  eventListeners
) => {
  const svgs = await Promise.all(
    svgObjects.map(s => {
      const fabricProp = getFabricPropByType(s.object.type, s.object);

      return getSvgData(
        s.object[svgUrlAttrName],
        { ...fabricProp, id: s.id },
        expectedHeight
      );
    })
  );

  if (isEmpty(svgs) || svgs.length != svgObjects.length) return;

  svgs.forEach(s => addEventListeners(s, eventListeners));

  svgs.length == 1
    ? addSingleSvg(svgs[0], canvas, isAddedToSinglePage, isPlaceInLeftPage)
    : addMultiSvg(svgs, canvas, isAddedToSinglePage, isPlaceInLeftPage);

  canvas.renderAll();
};
