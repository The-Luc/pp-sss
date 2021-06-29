import { fabric } from 'fabric';
import { cloneDeep, uniqueId } from 'lodash';

import { TextElement } from '@/common/models';
import { applyShadowToObject } from './common';

import {
  toFabricTextProp,
  toFabricTextBorderProp,
  toFabricTextGroupProp,
  isEmpty,
  ptToPx,
  inToPx,
  pxToIn
} from '@/common/utils';

import {
  TEXT_CASE,
  OBJECT_TYPE,
  DEFAULT_SPACING,
  DEFAULT_TEXT,
  TEXT_VERTICAL_ALIGN,
  OBJECT_MIN_SIZE
} from '@/common/constants';
import { getAdjustedObjectDimension } from './common';
import { toggleControlsVisibility } from './drawingBox';

/**
 * Handle creating a TextBox into canvas
 */
export const createTextBox = (x, y, width, height, textProperties) => {
  const newText = cloneDeep(TextElement);
  let isHasTextId = !!textProperties?.id;
  const id = isHasTextId ? textProperties?.id : uniqueId();

  const dataObject = {
    id,
    type: OBJECT_TYPE.TEXT,
    newObject: {
      ...(isHasTextId ? { ...textProperties } : { ...newText }),
      id,
      coord: {
        x: isHasTextId ? textProperties.coord.x : x,
        y: isHasTextId ? textProperties.coord.y : y,
        rotation: isHasTextId
          ? textProperties?.coord?.rotation
          : newText.coord.rotation
      }
    }
  };

  const textProp = toFabricTextProp(dataObject);
  const textVal = dataObject?.newObject?.text || DEFAULT_TEXT.TEXT;
  const text = new fabric.Textbox(textVal, {
    ...textProp,
    id: dataObject.id,
    left: 0,
    top: 0,
    width,
    originX: 'left',
    originY: 'top'
  });

  const {
    width: adjustedWidth,
    height: adjustedHeight
  } = getAdjustedObjectDimension(text, width, height);

  textVerticalAlignOnAdjust(text, adjustedHeight);

  const borderProp = toFabricTextBorderProp(dataObject);
  const rect = new fabric.Rect({
    ...borderProp,
    type: OBJECT_TYPE.RECT,
    id: dataObject.id,
    width: adjustedWidth,
    height: adjustedHeight,
    left: 0,
    top: 0,
    originX: 'left',
    originY: 'top',
    selectable: false
  });

  // reference to each other for better keep track
  text._rect = rect;
  rect._text = text;
  const group = new fabric.Group([rect, text], {
    id: dataObject.id,
    objectType: OBJECT_TYPE.TEXT,
    left: x,
    top: y,
    lockScalingY: false,
    lockScalingX: false,
    isConstrain: text.isConstrain
  });

  dataObject.newObject.size = {
    width: pxToIn(group.width),
    height: pxToIn(group.height)
  };

  dataObject.newObject.coord = {
    ...dataObject.newObject.coord,
    x: pxToIn(group.left),
    y: pxToIn(group.top)
  };

  dataObject.newObject.minHeight = pxToIn(text.height);
  dataObject.newObject.minWidth = pxToIn(text.getMinWidth());

  return { object: group, data: dataObject };
};

/**
 * To adjust Text Alignment in vertical dimension
 * @param {Object} text - the Fabric text object
 * @param {Number} rectHeight - the new rect height to align text
 */
export const textVerticalAlignOnAdjust = function(text, rectHeight) {
  if (text.height === rectHeight) return;

  if (text.verticalAlign === TEXT_VERTICAL_ALIGN.MIDDLE) {
    text.set({ top: text.top + (rectHeight - text.height) / 2 });
  }

  if (text.verticalAlign === TEXT_VERTICAL_ALIGN.BOTTOM) {
    text.set({ top: text.top + (rectHeight - text.height) });
  }
};

/**
 * To adjust Text Alignment in vertical dimension when user change Text Properties
 * @param {Object} text - the Fabric text object
 */
const textVerticalAlignWithGroup = function(text) {
  if (!text.group) return;

  switch (text.verticalAlign) {
    case TEXT_VERTICAL_ALIGN.MIDDLE:
      text.set({
        top: text.group.height * -0.5 + (text.group.height - text.height) / 2
      });
      break;

    case TEXT_VERTICAL_ALIGN.BOTTOM:
      text.set({
        top: text.group.height * -0.5 + (text.group.height - text.height)
      });
      break;

    default:
      text.set({
        top: text.group.height * -0.5
      });
      break;
  }
};

/**
 * To adjust Text Alignment in vertical dimension when user change Text Properties
 * @param {Object} text - the Fabric text object
 */
const textVerticalAlignWithRect = function(text) {
  if (!text._rect) return;

  const rect = text._rect;

  switch (text.verticalAlign) {
    case TEXT_VERTICAL_ALIGN.MIDDLE:
      text.set({
        top: rect.top + (rect.height - text.height) / 2
      });
      break;

    case TEXT_VERTICAL_ALIGN.BOTTOM:
      text.set({
        top: rect.top + (rect.height - text.height)
      });
      break;

    default:
      text.set({
        top: rect.top
      });
      break;
  }
};

/**
 * To adjust Text Alignment in vertical dimension when user change Text Properties
 * @param {Object} text - the Fabric text object
 */
export const textVerticalAlignOnApplyProperty = function(text) {
  if (text.group) {
    textVerticalAlignWithGroup(text);
  } else {
    textVerticalAlignWithRect(text);
  }
};

/**
 * Get all objects within a TextBox Group
 * @param {Object} textObject - the Fabric group object added to canvas
 * @returns {Array} list of objects
 */
export const getObjectsFromTextBox = function(textObject) {
  if (isEmpty(textObject)) {
    return [];
  }
  let text, rect;
  if (textObject.type === 'group') {
    [rect, text] = textObject._objects;
  } else {
    text = textObject;
    rect = text._rect;
  }
  return [rect, text];
};

/**
 * Handle update fabric object rendered on canvas
 * @param {Object}  text - the object to be updated
 * @param {Object}  prop - the prop change
 */
const applyTextProperties = function(text, prop) {
  if (isEmpty(text) || !text.canvas) {
    return;
  }
  const canvas = text.canvas;

  let curFontSize = text.get('fontSize');
  let curLineHeight = text.get('lineHeight'); // if = 1.2 => auto

  const textProp = toFabricTextProp(prop);
  Object.keys(textProp).forEach(k => {
    text.set(k, textProp[k]);
  });

  const lineSpacingProp = !isEmpty(prop['lineSpacing'])
    ? ptToPx(+prop['lineSpacing'] || 0)
    : null;
  const fontSizeProp = !isEmpty(prop['fontSize'])
    ? ptToPx(+prop['fontSize'])
    : null;

  if (fontSizeProp) {
    if (lineSpacingProp) {
      // if null or 0: lineSpacing auto reset by fabric
      const newLineSpacing = (fontSizeProp + lineSpacingProp) / fontSizeProp;
      text.set('lineHeight', newLineSpacing);
    } else if (curLineHeight !== DEFAULT_SPACING.VALUE) {
      const lineSpacing = curLineHeight * curFontSize - curFontSize; // px value
      const newLineSpacing = (fontSizeProp + lineSpacing) / fontSizeProp;
      text.set('lineHeight', newLineSpacing);
    }
  }

  if (!fontSizeProp && lineSpacingProp) {
    const newLineSpacing = (curFontSize + lineSpacingProp) / curFontSize;
    text.set('lineHeight', newLineSpacing);
  }

  const textString = text.get('text');
  if (!isEmpty(prop['textCase']) && !isEmpty(textString)) {
    if (prop['textCase'] === TEXT_CASE.NONE) {
      text.set('text', textString);
    }

    if (prop['textCase'] === TEXT_CASE.UPPER) {
      text.set('text', textString.toUpperCase());
    }

    if (prop['textCase'] === TEXT_CASE.LOWER) {
      text.set('text', textString.toLowerCase());
    }

    if (prop['textCase'] === TEXT_CASE.CAPITALIZE) {
      const changedText = textString.split('');
      for (let i = 0; i < changedText.length; i++) {
        changedText[i] = isEmpty(changedText[i - 1])
          ? changedText[i].toUpperCase()
          : changedText[i].toLowerCase();
      }
      text.set('text', changedText.join(''));
    }
  }

  const target = canvas.getActiveObject();
  if (!isEmpty(prop['fontSize']) && target !== text) {
    const textData = {
      top: -text.height / 2,
      left: -text.width / 2
    };
    text.set(textData);
  }

  if (!isEmpty(prop['shadow'])) {
    applyShadowToObject(text, prop['shadow']);
  }

  if (!isEmpty(textProp['width']) || !isEmpty(textProp['height'])) {
    updateObjectPosition(text, textProp['width'], textProp['height']);
  }

  updateTextBoxBaseOnNewTextSize(text);

  textVerticalAlignOnApplyProperty(text);

  canvas.renderAll();
};

/**
 * Handle resize group & rect if text size bigger than original
 * @param {Object} text - the text object that was updated
 */
const updateTextBoxBaseOnNewTextSize = function(textObject) {
  const [rect, text] = getObjectsFromTextBox(textObject);
  updateObjectDimensionsIfSmaller(rect, text.width, text.height);
  updateObjectDimensionsIfSmaller(text.group, text.width, text.height);
};

/**
 * Check and update a Fabric Object dimension if smaller than input width, height
 * @param {Object} obj - the object to be resized
 * @param {Number} width - the base width to compare
 * @param {Number} height - the base height to compare
 */
export const updateObjectDimensionsIfSmaller = function(obj, width, height) {
  if (isEmpty(obj)) return;

  if (width > obj.width) {
    obj.set({ width: width });
  }

  if (height > obj.height) {
    obj.set({ height: height });
  }
};

/**
 * Update a Fabric Object position base on width, height
 * @param {Object} obj - the object to be update
 * @param {Number} width - the base width to calculate
 * @param {Number} height - the base height to calculate
 */
const updateObjectPosition = function(obj, width, height) {
  if (isEmpty(obj)) return;

  if (width) {
    obj.set({ left: -width / 2 });
  }

  if (height) {
    obj.set({ top: -height / 2 });
  }
};

/**
 * Handle update fabric object rendered on canvas
 * @param {Object}  rect - the object to be updated
 * @param {Object}  prop - the prop change
 */
const applyTextRectProperties = function(rect, prop) {
  if (isEmpty(rect) || !rect.canvas) {
    return;
  }
  const canvas = rect.canvas;

  const rectProp = toFabricTextBorderProp(prop);
  const keyRect = Object.keys(rectProp);
  if (
    !isEmpty(rect.group) &&
    (keyRect.includes('strokeWidth') || keyRect.includes('strokeLineCap'))
  ) {
    const { strokeWidth } = rectProp;
    const strokeWidthVal = strokeWidth || rect.strokeWidth;
    rect.set({
      ...rect,
      width: rect.group.width - strokeWidthVal,
      height: rect.group.height - strokeWidthVal
    });
  }

  Object.keys(rectProp).forEach(k => {
    if (k.includes('fontSize')) {
      const { top, left } = rect._text || {};
      rect.set({ top, left });
    } else {
      rect.set(k, rectProp[k]);
    }
  });

  if (!isEmpty(prop['shadow'])) {
    applyShadowToObject(rect, prop['shadow']);
  }

  if (!isEmpty(rectProp['width']) || !isEmpty(rectProp['height'])) {
    updateObjectPosition(rect, rectProp['width'], rectProp['height']);
  }

  canvas.renderAll();
};

/**
 * Handle update fabric object rendered on canvas
 * @param {Object}  textObject - the object to be updated
 * @param {Object}  prop - the prop change
 */
const applyTextGroupProperties = function(textGroup, prop) {
  if (isEmpty(textGroup) || !textGroup.canvas) {
    return;
  }
  const canvas = textGroup.canvas;

  const textGroupProp = toFabricTextGroupProp(prop);

  if (!isEmpty(prop['isConstrain'])) {
    canvas.set({ uniformScaling: prop['isConstrain'] });
    toggleControlsVisibility(textGroup, prop['isConstrain']);
  }

  textGroup.set(textGroupProp);

  canvas.renderAll();
};

/**
 * Apply Text Properties Changed to Text Box
 * @param {Object} textObject - the object to be updated
 * @param {Object} prop - the prop change
 */
export const applyTextBoxProperties = function(textObject, prop) {
  const isModifyPosition = !isNaN(prop?.coord?.x) || !isNaN(prop?.coord?.y);
  const [rect, text] = getObjectsFromTextBox(textObject);
  applyTextGroupProperties(textObject, prop);
  if (isModifyPosition) {
    return;
  }
  applyTextProperties(text, prop);
  applyTextRectProperties(rect, prop);
};

/**
 * The function compute target dimenssion while scaling
 * @param {Object}  e  Text event data
 * @param {Element}  text  Text object
 */
export const handleScalingText = (e, text) => {
  const target = e.transform?.target;
  if (isEmpty(target)) return;

  const { width: w, height: h, scaleX, scaleY } = target;

  let scaledWidth = w * scaleX;

  if (scaledWidth < inToPx(OBJECT_MIN_SIZE)) {
    scaledWidth = inToPx(OBJECT_MIN_SIZE);
  }

  const scaledHeight = h * scaleY;

  target.set({
    scaleX: 1,
    scaleY: 1,
    width: scaledWidth,
    height: scaledHeight
  });

  if (scaledWidth < text.getMinWidth()) {
    text.set({ width: text.getMinWidth() });
    target.set({ width: text.getMinWidth() });
  }

  if (scaledHeight < text.height) {
    target.set({ height: text.height });
  }
};
