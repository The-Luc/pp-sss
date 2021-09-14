import { fabric } from 'fabric';
import { cloneDeep } from 'lodash';
import Color from 'color';

import {
  DEFAULT_SVG,
  DEFAULT_SHAPE,
  OBJECT_TYPE,
  DEFAULT_TEXT,
  TEXT_HORIZONTAL_ALIGN,
  TEXT_CASE_VALUE,
  HTML_BORDER_STYLE
} from '@/common/constants';

import {
  inToPx,
  ptToPx,
  isEmpty,
  mapObject,
  scaleSize,
  pxToIn,
  ptToPxPreview,
  inToPxPreview
} from '@/common/utils';
import { toFabricMediaProp } from './image';

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
 * Convert stored text properties to fabric properties
 *
 * @param   {Object}  prop  stored text properties
 * @returns {Object}        fabric properties
 */
export const toFabricTextProp = prop => {
  const mapRules = {
    data: {
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
      horizontal: {
        name: 'textAlign'
      },
      vertical: {
        name: 'verticalAlign'
      },
      letterSpacing: {
        name: 'charSpacing',
        parse: value => scaleSize(value)
      },
      strokeWidth: {
        name: 'padding',
        parse: value => scaleSize(value || 0) + inToPx(DEFAULT_TEXT.PADDING)
      }
    },
    restrict: [
      'id',
      'type',
      'textCase',
      'text',
      'fill',
      'size',
      'stroke',
      'strokeDashArray',
      'strokeLineType',
      'shadow',
      'flip',
      'rotation',
      'isConstrain',
      'coord',
      'animationIn',
      'animationOut'
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
      strokeWidth: {
        name: 'strokeWidth',
        parse: value => scaleSize(value)
      }
    },
    restrict: [
      'id',
      'shadow',
      'size',
      'flip',
      'rotation',
      'isConstrain',
      'style',
      'coord',
      'animationIn',
      'animationOut'
    ]
  };

  return mapObject(prop, mapRules);
};

/**
 * Convert stored text group properties to fabric properties
 *
 * @param   {Object}  style stored text border properties
 * @returns {Object}        fabric properties
 */
export const toFabricTextGroupProp = prop => {
  const mapRules = {
    data: {
      x: DEFAULT_RULE_DATA.X,
      y: DEFAULT_RULE_DATA.Y,
      rotation: DEFAULT_RULE_DATA.ROTATION,
      horizontal: DEFAULT_RULE_DATA.HORIZONTAL,
      vertical: DEFAULT_RULE_DATA.VERTICAL,
      width: DEFAULT_RULE_DATA.WIDTH,
      height: DEFAULT_RULE_DATA.HEIGHT
    },
    restrict: [
      'id',
      'shadow',
      'alignment',
      'fontSize',
      'rotation',
      'style',
      'animationIn',
      'animationOut'
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

export const toCssPreview = (prop, previewHeight) => {
  const isOneLine = prop.nameLines === 1 ? 'justifyContent' : 'alignItems';
  const horizontal = prop.isPageTitleOn ? 'textAlign' : isOneLine;

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
      fontColor: {
        name: 'color'
      },
      fontSize: {
        name: 'fontSize',
        parse: value => `${ptToPxPreview(value, previewHeight)}px`
      },
      horizontal: {
        name: horizontal,
        parse: value => parseHorizontal(prop, value)
      },
      textCase: {
        name: 'textTransform',
        parse: value => TEXT_CASE_VALUE[value]
      },
      nameLines: {
        name: 'flexDirection',
        parse: value => {
          const direction = value === 1 ? 'row' : 'column';
          return prop.isFirstLastDisplay ? direction : `${direction}-reverse`;
        }
      },
      top: {
        name: 'paddingTop',
        parse: value => `${inToPxPreview(value, previewHeight)}px`
      },
      bottom: {
        name: 'paddingBottom',
        parse: value => `${inToPxPreview(value, previewHeight)}px`
      },
      left: {
        name: 'paddingLeft',
        parse: value => `${inToPxPreview(value, previewHeight)}px`
      },
      right: {
        name: 'paddingRight',
        parse: value => `${inToPxPreview(value, previewHeight)}px`
      }
    },
    restrict: []
  };

  const cssStyle = mapObject(prop, mapRules);
  cssStyle.lineHeight = cssStyle.fontSize;

  return cssStyle;
};
/**
 * Convert stored properties to css preview
 *
 * @param   {Object}  prop  stored properties
 * @returns {Object}        css preview
 */
export const toMarginCssPreview = (prop, previewHeight) => {
  const mapRules = {
    data: {
      top: {
        name: 'marginTop',
        parse: value => `${inToPxPreview(value, previewHeight)}px`
      },
      bottom: {
        name: 'marginBottom',
        parse: value => `${inToPxPreview(value, previewHeight)}px`
      },
      left: {
        name: 'marginLeft',
        parse: value => `${inToPxPreview(value, previewHeight)}px`
      },
      right: {
        name: 'marginRight',
        parse: value => `${inToPxPreview(value, previewHeight)}px`
      }
    },
    restrict: []
  };

  return mapObject(prop, mapRules);
};
/**
 * Get value horizontal
 *
 * @param   {Object}  prop   new property
 * @param   {String}  value  new property
 * @returns {String}         value of horizoltal
 */
const parseHorizontal = (prop, value) => {
  if (prop.isPageTitleOn) return value;

  const isOneLine = prop.nameLines === 1 && !prop.isFirstLastDisplay;
  const alignLeft = isOneLine ? 'flex-end' : 'flex-start';
  const alignRight = isOneLine ? 'flex-start' : 'flex-end';

  if (value === TEXT_HORIZONTAL_ALIGN.RIGHT) return alignRight;

  return value === TEXT_HORIZONTAL_ALIGN.LEFT ? alignLeft : value;
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

  if (elementType === OBJECT_TYPE.IMAGE || elementType === OBJECT_TYPE.VIDEO) {
    return toFabricMediaProp(prop, element);
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
 * Update specific of element on canvas
 *
 * @param {Object} element the element will have property changed
 * @param {Object} prop new property
 */
export const updateSpecificProp = (element, prop) => {
  // update angle of element
  if (!isEmpty(prop?.coord?.rotation)) element.rotate(prop.coord.rotation);

  if (!isEmpty(prop?.shadow)) applyShadowToObject(element, prop.shadow);

  if (!isEmpty(prop?.cropInfo)) element.set({ cropInfo: prop.cropInfo });
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

  updateSpecificProp(element, prop);

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
 * @param   {Number}  expectedWidth   the view width of svg element
 * @returns {Object}                  the svg data
 */
export const getSvgData = (
  svgUrl,
  elementProperty,
  expectedHeight,
  expectedWidth
) => {
  return new Promise(resolve => {
    fabric.loadSVGFromURL(svgUrl, (objects, options) => {
      const svg = fabric.util.groupSVGElements(objects, options);

      const scaleY = inToPx(expectedHeight) / svg.height;
      const scaleX = inToPx(expectedWidth) / svg.width;

      svg.set({
        ...elementProperty,
        width: svg.width,
        height: svg.height,
        scaleX: scaleX,
        scaleY: scaleY,
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
 * @param {Number} expectedWidth - the svg's expected width want to draw
 * @returns {Object} Svg object
 */
export const handleGetSvgData = async ({
  svg,
  svgUrlAttrName,
  expectedHeight = DEFAULT_SVG.HEIGHT,
  expectedWidth = DEFAULT_SVG.WIDTH
}) => {
  const fabricProp = getFabricPropByType(svg.object.type, svg.object);

  return await getSvgData(
    svg.object[svgUrlAttrName],
    { ...fabricProp, id: svg.id },
    expectedHeight,
    expectedWidth
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
  const padding = object.padding || 0;

  const objectWidth = object.width + padding * 2;
  const objectHeight = object.height + padding * 2;

  const width = Math.max(objectWidth, targetWidth);
  const height = Math.max(objectHeight, targetHeight);

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

/**
 * Convert fabric object to parallel object for save to store
 *
 * @param   {Object}  fabricObject  Fabric object selected
 * @returns {Object}                properties will be saved to store
 */
export const fabricToPpObject = fabricObject => {
  const { top, left, width, height, scaleX, scaleY, angle } = fabricObject;

  return {
    coord: {
      x: pxToIn(left),
      y: pxToIn(top),
      rotation: angle
    },
    size: {
      width: pxToIn(width * scaleX),
      height: pxToIn(height * scaleY)
    }
  };
};

/**
 * Create image from svg element
 * @param {Number} val object's order
 * @param {*} fill background color
 * @return image element
 */
const createSVGElement = (val, fill) => {
  return new Promise(resolve => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const DOMURL = window.URL || window.webkitURL || window;
    const img = new Image();

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '100');

    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('stroke', 'black');
    rect.setAttribute('stroke-width', '10');
    rect.setAttribute('fill', fill);

    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', '50%');
    text.setAttribute('y', '50%');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '50');
    text.innerHTML = val;

    svg.append(rect);
    svg.append(text);

    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], {
      type: 'image/svg+xml;charset=utf-8'
    });

    const url = DOMURL.createObjectURL(blob);

    img.onload = function() {
      resolve(img);
      DOMURL.revokeObjectURL(url);
    };

    img.src = url;
  });
};

/**
 * Handle when select object
 * @param {Object} target fabric object
 * @param {Object} data object data stored
 */
export const handleObjectSelected = async (target, data) => {
  if (target.objectType === OBJECT_TYPE.TEXT) {
    const playInOrder = data?.animationIn?.order || target?.playInOrder || 1;
    const playOutOrder = data?.animationOut?.order || target?.playOutOrder || 1;
    const playInEle = createSVGElement(playInOrder, 'white');
    const playOutEle = createSVGElement(playOutOrder, 'lightgray');
    const [playIn, playOut] = await Promise.all([playInEle, playOutEle]);
    target.set({ playIn, playOut, dirty: true });
    target.canvas.renderAll();
  }
};

/**
 * Handle when deselect object
 * @param {Object} target fabric object
 */
export const handleObjectDeselected = target => {
  target.set({ playIn: null, playOut: null, dirty: true });
  target.canvas.renderAll();
};

/**
 * Calculate animation order after delete objects
 * @param {Element} canvas active canvas
 * @return updated objects
 */
export const calcAnimationOrder = canvas => {
  const objs = canvas
    .getObjects()
    .filter(
      obj => obj?.objectType && obj.objectType !== OBJECT_TYPE.BACKGROUND
    );
  const updatedObjs = [];

  objs.forEach(obj => {
    const playInOrder = obj.get('playInOrder') || 1;
    const playOutOrder = obj.get('playOutOrder') || 1;

    obj.set({
      playInOrder: Math.min(objs.length, playInOrder),
      playOutOrder: Math.min(objs.length, playOutOrder)
    });

    updatedObjs.push({
      id: obj.id,
      prop: {
        animationIn: {
          order: Math.min(objs.length, playInOrder)
        },
        animationOut: {
          order: Math.min(objs.length, playOutOrder)
        }
      }
    });
  });

  return updatedObjs;
};

export const toCssBorder = (prop, previewHeight) => {
  const mapRules = {
    data: {
      stroke: {
        name: 'borderColor'
      },
      strokeWidth: {
        name: 'borderWidth',
        parse: value => `${Math.ceil(ptToPxPreview(value, previewHeight))}px`
      },
      strokeLineType: {
        name: 'borderStyle',
        parse: value => HTML_BORDER_STYLE[value]
      }
    },
    restrict: ['strokeDashArray', 'showBorder']
  };

  const cssStyle = mapObject(prop, mapRules);

  const { showBorder } = prop;
  cssStyle.borderWidth = showBorder ? cssStyle.borderWidth : '0';

  return cssStyle;
};

export const toCssShadow = (prop, previewHeight) => {
  const { dropShadow, shadowAngle, shadowBlur, shadowColor, shadowOffset } =
    prop || {};

  const rad = (-Math.PI * (shadowAngle % 360)) / 180;
  const blur = Math.ceil(ptToPxPreview(shadowBlur, previewHeight));

  const offsetX = Math.ceil(
    ptToPxPreview(shadowOffset * Math.sin(rad), previewHeight)
  );
  const offsetY = Math.ceil(
    ptToPxPreview(shadowOffset * Math.cos(rad), previewHeight)
  );

  const boxShadow = `${offsetX}px ${offsetY}px ${blur}px ${shadowColor}`;

  return dropShadow ? { boxShadow } : {};
};
