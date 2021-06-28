import { fabric } from 'fabric';
import { cloneDeep } from 'lodash';
import Color from 'color';

import { DEFAULT_SHAPE, OBJECT_TYPE } from '@/common/constants';

import { inToPx, ptToPx, isEmpty, mapObject, scaleSize } from '@/common/utils';

export const DEFAULT_RULE_DATA = {
  TYPE: {
    name: 'objectType'
  },
  X: {
    name: 'left',
    parse: value => inToPx(value)
  },
  Y: {
    name: 'top',
    parse: value => inToPx(value)
  },
  ROTATION: {
    name: 'angle'
  },
  COLOR: {
    name: 'fill'
  },
  HORIZONTAL: {
    name: 'flipX'
  },
  VERTICAL: {
    name: 'flipY'
  },
  WIDTH: {
    name: 'width',
    parse: value => inToPx(value)
  },
  HEIGHT: {
    name: 'height',
    parse: value => inToPx(value)
  }
};

const RESTRICT_PROP_CHILD = [
  'scaleX',
  'scaleY',
  'angle',
  'flipX',
  'flipY',
  'top',
  'left'
];

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
      x: DEFAULT_RULE_DATA.X,
      y: DEFAULT_RULE_DATA.Y,
      rotation: DEFAULT_RULE_DATA.ROTATION,
      color: DEFAULT_RULE_DATA.COLOR,
      horizontal: DEFAULT_RULE_DATA.HORIZONTAL,
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
    restrict: ['id', 'name', 'thumbnail', 'pathData', 'border']
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
      x: DEFAULT_RULE_DATA.X,
      y: DEFAULT_RULE_DATA.Y,
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
      horizontal: DEFAULT_RULE_DATA.HORIZONTAL,
      vertical: DEFAULT_RULE_DATA.VERTICAL
    },
    restrict: ['id', 'name', 'thumbnail', 'border']
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

  element.setCoords();

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
  const useProp = cloneDeep(prop);

  RESTRICT_PROP_CHILD.forEach(rp => {
    delete useProp[rp];
  });

  if (element.getObjects) {
    element.getObjects().forEach(o => o.set(useProp));
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
        scaleX: scale,
        scaleY: scale,
        ...(elementProperty.fillMode === 'fill' && {
          strokeWidth: DEFAULT_SHAPE.BORDER.STROKE_WIDTH
        })
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

  const group = new fabric.Group(svgs);

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
 * Function handle svg data with fabric prop
 * @param {Object} svg - The svg's data
 * @param {String} svgUrlAttrName - the attribute name contain svg url
 * @param {Number} expectedHeight - the svg's expected height want to draw
 * @returns {Object} Svg object
 */
export const handleGetSvgData = async ({
  svg,
  svgUrlAttrName,
  expectedHeight
}) => {
  const fabricProp = getFabricPropByType(svg.object.type, svg.object);

  return await getSvgData(
    svg.object[svgUrlAttrName],
    { ...fabricProp, id: svg.id },
    expectedHeight
  );
};

/**
 * Function add svgs to canvas
 * @param {Array} svgs - list of sgv will be added
 * @param {Ref} canvas - Canvas element
 * @param {Boolean} isAddedToSinglePage - is sgv will be added to single page
 * @param {Boolean} isPlaceInLeftPage - is sgv will be added to left page
 */
const handleAddSvgsToCanvas = ({
  svgs,
  canvas,
  isAddedToSinglePage,
  isPlaceInLeftPage
}) => {
  svgs.length == 1
    ? addSingleSvg(svgs[0], canvas, isAddedToSinglePage, isPlaceInLeftPage)
    : addMultiSvg(svgs, canvas, isAddedToSinglePage, isPlaceInLeftPage);
};

/**
 * Adding svgs to canvas
 *
 * @param {Array}   svgObjects          list of sgv will be added
 * @param {String}  svgUrlAttrName      the attribute name contain svg url
 * @param {Number}  expectedHeight      the attribute name contain svg url
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
      return handleGetSvgData({
        svg: s,
        svgUrlAttrName,
        expectedHeight
      });
    })
  );

  if (isEmpty(svgs) || svgs.length != svgObjects.length) return;

  svgs.forEach(s => addEventListeners(s, eventListeners));

  handleAddSvgsToCanvas({
    svgs,
    canvas,
    isAddedToSinglePage,
    isPlaceInLeftPage
  });

  canvas.renderAll();

  return svgs;
};

/**
 * Get text dimensions { width, height } after auto adjusted by fabric
 * @param {Object} object - the fabric object
 * @param {Number} targetWidth - the target width to compare
 * @param {Number} targetHeight - the target height to compare
 * @returns {Object} dimensions { width, height } that text can use
 */
export const getAdjustedObjectDimension = function(
  object,
  targetWidth,
  targetHeight
) {
  const width = object.width > targetWidth ? object.width : targetWidth;
  const height = object.height > targetHeight ? object.height : targetHeight;
  return { width, height };
};

/**
 * Calculate shadow base on config from user
 * @param {Boolean} dropShadow - have shadow or not
 * @param {Number} shadowBlur - the level of blur in pt
 * @param {Number} shadowOffset - the offset in pt
 * @param {Number} shadowOpacity - the opacity of the shadow
 * @param {Number} shadowAngle - the angle to apply shadow
 * @param {String} shadowColor - the color to apply to shadow
 * @returns {Object} the Fabric Shadow Object
 */
const getShadowBaseOnConfig = function({
  dropShadow,
  shadowBlur,
  shadowOffset,
  shadowOpacity,
  shadowAngle,
  shadowColor
}) {
  if (!dropShadow) return {};

  const clr = Color(shadowColor)
    .alpha(shadowOpacity)
    .toString();

  const adjustedAngle = shadowAngle % 360;
  const rad = (-1 * adjustedAngle * Math.PI) / 180;

  const offsetX = shadowOffset * Math.sin(rad);
  const offsetY = shadowOffset * Math.cos(rad);

  const shadow = new fabric.Shadow({
    color: clr,
    offsetX: ptToPx(offsetX),
    offsetY: ptToPx(offsetY),
    blur: ptToPx(shadowBlur)
  });

  return shadow;
};

/**
 * Apply Shadow to Fabric Object
 * @param {Object} fabricObject - the object to be updated
 * @param {Object} shadowConfig - the shadow config by user, contains
 * { dropShadow, shadowBlur, shadowOffset, shadowOpacity, shadowAngle, shadowColor }
 */
export const applyShadowToObject = function(fabricObject, shadowConfig) {
  if (isEmpty(fabricObject) || isEmpty(shadowConfig)) return;
  const shadow = getShadowBaseOnConfig(shadowConfig);

  shadow.offsetX /= fabricObject.scaleX;
  shadow.offsetY /= fabricObject.scaleY;
  shadow.blur /= (fabricObject.scaleX + fabricObject.scaleY) * 0.5;

  fabricObject.set({ shadow });
};

/**
 * Caculation scale element
 *
 * @param {Number}  widthElement  width's element
 * @param {Number}  currentWidthInch  current width inch of element
 * @param {Nunber}  currentHeightInch current height inch of element
 * @param {Number}  minSize  min size of element
 */
export const calcScaleElement = (
  widthElement,
  currentWidthInch,
  currentHeightInch,
  minSize
) => {
  let scaleX = null;
  let scaleY = null;
  const minScale = inToPx(minSize) / widthElement;
  if (currentWidthInch < minSize) {
    scaleX = minScale;
  }

  if (currentHeightInch < minSize) {
    scaleY = minScale;
  }
  return {
    x: scaleX,
    y: scaleY
  };
};

/**
 * Mapping Element Properties
 *
 * @param {Number}   currentWidthInch current width inch of element
 * @param {Number}  currentHeightInch current height inch of element
 * @param {Number}  currentXInch current position x inch of element
 * @param {Number}  currentYInch current position y inch of element
 * @param {Number} minSize min size of element
 */
export const mappingElementProperties = (
  currentWidthInch,
  currentHeightInch,
  currentXInch,
  currentYInch,
  minSize
) => {
  return {
    size: {
      width: currentWidthInch < minSize ? minSize : currentWidthInch,
      height: currentHeightInch < minSize ? minSize : currentHeightInch
    },
    coord: {
      x: currentXInch,
      y: currentYInch
    }
  };
};
/**
 * Delete object from canvas by id
 *
 * @param {Array}   ids     list of id of object to be removed
 * @param {Object}  canvas  the canvas contain object
 */
export const deleteObjectById = (ids, canvas) => {
  canvas.getObjects().forEach(o => {
    if (ids.includes(o.id)) canvas.remove(o);
  });
};
/**
 * Handle update blur value after scale object
 *
 * @param {Number}   blurValue blur value before scale object
 * @param {Object}  oldScale  scale value before scale object
 * @param {Object}  newScale  scale value after scale object
 * @returns {Number} blur value after scale object
 */
export const handleObjectBlur = (blurValue, oldScale, newScale) => {
  const blur =
    (blurValue * (oldScale.scaleX + oldScale.scaleY)) /
    (newScale.scaleX + newScale.scaleY);
  return blur;
};
