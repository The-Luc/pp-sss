import { fabric } from 'fabric';
import { cloneDeep, merge, uniqueId } from 'lodash';

import { TextElement } from '@/common/models';
import { applyShadowToObject } from './common';

import { isEmpty, inToPx, pxToIn, getStrokeLineCap } from '@/common/utils';

import {
  TEXT_CASE,
  OBJECT_TYPE,
  DEFAULT_TEXT,
  TEXT_VERTICAL_ALIGN,
  OBJECT_MIN_SIZE,
  FABRIC_OBJECT_TYPE
} from '@/common/constants';
import {
  getAdjustedObjectDimension,
  toFabricTextProp,
  toFabricTextBorderProp,
  toFabricTextGroupProp
} from './common';
import { useDoubleStroke, useTextOverride } from '@/plugins/fabric';

/**
 * Handle creating a TextBox into canvas
 */
export const createTextBox = (x, y, width, height, textProperties) => {
  let newText = cloneDeep(TextElement);
  const id = textProperties?.id || uniqueId();
  merge(newText, {
    text: DEFAULT_TEXT.TEXT,
    coord: { ...newText.coord, x: pxToIn(x), y: pxToIn(y) },
    ...textProperties,
    id
  });

  const dataObject = {
    id: newText.id,
    type: OBJECT_TYPE.TEXT,
    newObject: { ...newText }
  };

  const textProp = toFabricTextProp(dataObject);

  const padding = textProp.padding || inToPx(DEFAULT_TEXT.PADDING);

  const text = new fabric.Textbox(newText.text, {
    ...textProp,
    id: dataObject.id,
    left: padding,
    top: padding,
    width: width - padding * 2,
    padding
  });

  updateTextCase(text, dataObject.newObject);

  useTextOverride(text);

  const {
    width: adjustedWidth,
    height: adjustedHeight
  } = getAdjustedObjectDimension(text, width, height);

  const borderProp = toFabricTextBorderProp(dataObject);

  const strokeWidth = borderProp.strokeWidth || 0;

  const rect = new fabric.Rect({
    ...borderProp,
    type: OBJECT_TYPE.RECT,
    id: dataObject.id,
    width: adjustedWidth - strokeWidth,
    height: adjustedHeight - strokeWidth,
    left: 0,
    top: 0,
    strokeWidth,
    fill: false,
    selectable: false
  });

  useDoubleStroke(rect);

  // reference to each other for better keep track
  text._rect = rect;
  rect._text = text;

  const angle = textProperties?.coord?.rotation || DEFAULT_TEXT.COORD.ROTATION;
  const group = new fabric.Group([rect, text], {
    id: dataObject.id,
    objectType: OBJECT_TYPE.TEXT,
    left: x,
    top: y,
    lockScalingY: false,
    lockScalingX: false,
    isConstrain: text.isConstrain,
    angle
  });

  const groupProp = toFabricTextGroupProp(dataObject);
  const { flipX, flipY } = groupProp;
  group.set({ flipX, flipY });

  const rectStrokeData = getRectStroke(rect, {
    ...borderProp,
    width: adjustedWidth,
    height: adjustedHeight
  });
  rect.set(rectStrokeData);

  textVerticalAlignOnApplyProperty(text);

  dataObject.newObject.size = {
    width: pxToIn(group.width),
    height: pxToIn(group.height)
  };

  const { minBoundingWidth, minBoundingHeight } = getTextSizeWithPadding(text);

  dataObject.newObject.minWidth = pxToIn(minBoundingWidth);
  dataObject.newObject.minHeight = pxToIn(minBoundingHeight);

  return { object: group, data: dataObject };
};

/**
 * To adjust Text Alignment when user change Text Properties
 * @param {Object} text - the Fabric text object
 */
const textAlignWithGroup = function(text) {
  if (!text.group) return;

  const defaultTop = text.group.height * -0.5 + text.padding;
  const defaultLeft = text.group.width * -0.5 + text.padding;

  const { minBoundingHeight } = getTextSizeWithPadding(text);

  switch (text.verticalAlign) {
    case TEXT_VERTICAL_ALIGN.MIDDLE:
      text.set({
        left: defaultLeft,
        top: defaultTop + (text.group.height - minBoundingHeight) / 2
      });
      break;

    case TEXT_VERTICAL_ALIGN.BOTTOM:
      text.set({
        left: defaultLeft,
        top: defaultTop + (text.group.height - minBoundingHeight)
      });
      break;

    default:
      text.set({
        left: defaultLeft,
        top: defaultTop
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
    textAlignWithGroup(text);
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

  const textProp = toFabricTextProp(prop);
  text.set(textProp);

  updateTextSize(text, prop);

  updateTextCase(text, prop);

  const target = canvas.getActiveObject();
  if (
    !isEmpty(prop.fontSize) ||
    !isEmpty(prop.style) ||
    !isEmpty(prop.lineSpacing) ||
    !isEmpty(prop.fontFamily) ||
    !isEmpty(prop.letterSpacing) ||
    !isEmpty(prop.textCase)
  ) {
    if (target.type === FABRIC_OBJECT_TYPE.TEXT) {
      target.fire('changed');
    } else {
      updateTextBoxBaseOnNewTextSize(text);
    }
  }

  if (prop.shadow) {
    applyShadowToObject(text, prop.shadow);
  }

  textVerticalAlignOnApplyProperty(text);
};

const addPadding = (val, padding) => val - padding * 2;

const updateTextSize = (text, prop) => {
  if (!prop.size) return;

  const newWidth = addPadding(inToPx(prop.size.width), text.padding);
  const newHeight = addPadding(inToPx(prop.size.height), text.padding);
  const { minBoundingWidth, minBoundingHeight } = getTextSizeWithPadding(text);

  const sizeData = {};

  sizeData.width = Math.max(newWidth, minBoundingWidth);
  sizeData.height = Math.max(newHeight, minBoundingHeight);

  text.set(sizeData);
};

const updateTextCase = (text, prop) => {
  let textString = text.get('text');

  if (!isEmpty(prop.textCase) && !isEmpty(textString)) {
    if (prop.textCase === TEXT_CASE.UPPER) {
      textString = textString.toUpperCase();
    }

    if (prop.textCase === TEXT_CASE.LOWER) {
      textString = textString.toLowerCase();
    }

    if (prop.textCase === TEXT_CASE.CAPITALIZE) {
      const changedText = textString.split('');
      for (let i = 0; i < changedText.length; i++) {
        changedText[i] = isEmpty(changedText[i - 1])
          ? changedText[i].toUpperCase()
          : changedText[i].toLowerCase();
      }
      textString = changedText.join('');
    }

    text.set({ text: textString });
  }
};

/**
 * Handle resize group & rect if text size bigger than original
 * @param {Object} text - the text object that was updated
 */
const updateTextBoxBaseOnNewTextSize = function(textObject) {
  const [rect, text] = getObjectsFromTextBox(textObject);
  const {
    minBoundingWidth: width,
    minBoundingHeight: height
  } = getTextSizeWithPadding(text);
  updateObjectDimensionsIfSmaller(rect, width, height);
  updateObjectDimensionsIfSmaller(text.group, width, height);
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
 * Get rect stroke data
 * @param {fabric.Rect} rect - the rect to have stroke calculated
 * @param {Object} borderProp - the prop to set for border
 * @returns {Object} strokeData
 */
const getRectStroke = (rect, borderProp) => {
  const { width, height } = borderProp;
  const stroke = borderProp.stroke || rect.stroke;
  const strokeLineType = borderProp.strokeLineType || rect.strokeLineType;
  const strokeLineCap = getStrokeLineCap(strokeLineType);
  let strokeWidth = rect.strokeWidth || 0;
  if (!isEmpty(borderProp.strokeWidth)) {
    strokeWidth = borderProp.strokeWidth;
  }

  const rectWidth = width - strokeWidth;
  const rectHeight = height - strokeWidth;

  return {
    top: height * -0.5,
    left: width * -0.5,
    height: rectHeight,
    width: rectWidth,
    stroke,
    strokeLineType,
    strokeWidth,
    strokeLineCap
  };
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

  const rectProp = toFabricTextBorderProp(prop);

  if (!isEmpty(rect.group)) {
    const rectStrokeData = getRectStroke(rect, {
      ...rectProp,
      width: rect.group.width,
      height: rect.group.height,
      dirty: true
    });
    rect.set(rectStrokeData);
  }

  if (!isEmpty(prop.shadow)) {
    applyShadowToObject(rect, prop.shadow);
  }
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

  // handle rotation case
  if (!isEmpty(prop?.coord?.rotation)) {
    textGroup.rotate(prop.coord.rotation);
  }

  const textGroupProp = toFabricTextGroupProp(prop);

  if (!isEmpty(prop['isConstrain'])) {
    canvas.set({ uniformScaling: prop['isConstrain'] });
  }

  textGroup.set(textGroupProp);
  textGroup.setCoords();
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
    textObject?.canvas?.renderAll();
    return;
  }

  if (!prop.border && !prop.size) {
    applyTextRectProperties(rect, prop);
  }

  applyTextProperties(text, prop);

  if (!prop.border && !prop.size) {
    textObject?.canvas?.renderAll();
    return;
  }

  const { minBoundingWidth, minBoundingHeight } = getTextSizeWithPadding(text);

  adjustGroupDimension(textObject, minBoundingWidth, minBoundingHeight);
  applyTextRectProperties(rect, prop);

  textVerticalAlignOnApplyProperty(text);

  setTimeout(() => {
    textObject?.canvas?.renderAll();
    textObject.fire('scaled', { transform: { target: textObject } });
  });
};

/**
 * Update Group dimension base on width & height
 * @param {fabric.Group} group - the fabric group to be updated
 * @param {Number} width - the width value to update
 * @param {Number} height - the height value to update
 */
const adjustGroupDimension = function(group, width, height) {
  const groupWidth = Math.max(width, group.width);
  const groupHeight = Math.max(height, group.height);

  const size = {};

  if (groupWidth !== group.width) {
    size.width = pxToIn(groupWidth);
  }

  if (groupHeight !== group.height) {
    size.height = pxToIn(groupHeight);
  }

  if (!isEmpty(size)) {
    applyTextGroupProperties(group, { size });
  }
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

  const {
    minWidth,
    minBoundingWidth,
    minBoundingHeight
  } = getTextSizeWithPadding(text);

  if (scaledWidth < minBoundingWidth) {
    text.set({ width: minWidth });
    target.set({ width: minBoundingWidth });
  }

  if (scaledHeight < minBoundingHeight) {
    target.set({ height: minBoundingHeight });
  }
};

export const getTextSizeWithPadding = text => {
  const minWidth = text.getMinWidth();
  const minBoundingWidth = minWidth + (text.padding || 0) * 2;

  const minHeight = text.height;
  const minBoundingHeight = minHeight + (text.padding || 0) * 2;

  return { minWidth, minBoundingWidth, minHeight, minBoundingHeight };
};

/**
 * Set new dimenssion for text after scaled
 * @param {Object} target Text target
 * @param {Element} rect Rect object
 * @param {Element} text Text object
 */
export const setTextDimensionAfterScaled = (target, rect, text) => {
  const padding = text.padding || DEFAULT_TEXT.PADDING;

  text.set({
    width: target.width - padding * 2
  });

  const {
    width: adjustedWidth,
    height: adjustedHeight
  } = getAdjustedObjectDimension(text, target.width, target.height);

  const rectStrokeData = getRectStroke(rect, {
    width: adjustedWidth,
    height: adjustedHeight
  });
  rect.set(rectStrokeData);

  target.set({
    width: adjustedWidth,
    height: adjustedHeight
  });

  textAlignWithGroup(text);

  target.canvas?.renderAll();
};

/**
 * The function is called while user editing text and update text/rect properties
 * @param {Object}  textObject  Text object data
 * @param {Object}  rectObject  Rect object data
 * @param {Object}  group  The group object contains text and rect object
 * @param {Object}  cachedData  Group's data is cached
 * @param {Function} onCompleted - callback to execute when finish editting
 */
export const updateTextListeners = (
  textObject,
  rectObject,
  group,
  cachedData,
  onCompleted
) => {
  const canvas = group.canvas;
  const [rect, text] = group._objects;

  let currentText = textObject.get('text');

  const onTextChanged = () => {
    currentText = textObject.get('text');

    const { minBoundingWidth, minBoundingHeight } = getTextSizeWithPadding(
      textObject
    );

    updateObjectDimensionsIfSmaller(
      rectObject,
      minBoundingWidth,
      minBoundingHeight
    );

    canvas.renderAll();
  };

  const getNewData = obj => {
    return Object.keys(obj).reduce((rs, key) => {
      if (
        key !== 'id' &&
        !key.startsWith('_') &&
        typeof obj[key] !== 'function'
      ) {
        rs[key] = obj[key];
      }
      return rs;
    }, {});
  };

  const onDoneEditText = () => {
    const newProperties = {
      angle: 0,
      flipX: false,
      flipY: false,
      visible: true
    };

    textObject.group = null;
    rectObject.group = null;

    const newTextData = { ...getNewData(textObject), ...newProperties };
    const newRectData = { ...getNewData(rectObject), ...newProperties };

    // TODO: update rect data
    rect.set(newRectData);
    text.set(newTextData);

    group.addWithUpdate();

    textObject.visible = false;
    rectObject.visible = false;

    canvas.remove(textObject);
    canvas.remove(rectObject);

    group.set(cachedData);

    onCompleted && onCompleted({ text: currentText });

    canvas.renderAll();
  };

  textObject.on('changed', onTextChanged);
  textObject.on('editing:exited', onDoneEditText);
};

/**
 * Event fire when user double click on Text area and allow user edit text as
 * @param {fabric.Object} group - Text Group element
 * @param {Function} onCompleted - callback to execute when finish editting
 */
export const enableTextEditMode = (group, onCompleted) => {
  const canvas = group.canvas;
  if (isEmpty(canvas)) return;

  const [rect, text] = getObjectsFromTextBox(group);

  const textForEditing = cloneDeep(text);
  textForEditing.id = null;

  const rectForEditing = cloneDeep(rect);
  const { flipX, flipY, angle, top, left } = cloneDeep(group);
  const cachedData = { flipX, flipY, angle, top, left };

  text.visible = false;
  rect.visible = false;

  group.addWithUpdate();

  updateTextListeners(
    textForEditing,
    rectForEditing,
    group,
    cachedData,
    onCompleted
  );

  canvas.add(rectForEditing);
  canvas.add(textForEditing);

  canvas.setActiveObject(textForEditing);

  textForEditing.enterEditing();
  textForEditing.selectAll();
};
