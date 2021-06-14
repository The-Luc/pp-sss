import { fabric } from 'fabric';
import { cloneDeep, uniqueId } from 'lodash';
import { TextElement } from '@/common/models';
import Color from 'color';

import {
  toFabricTextProp,
  toFabricTextBorderProp,
  isEmpty,
  ptToPx,
  getRectDashes
} from '@/common/utils';

import {
  TEXT_CASE,
  OBJECT_TYPE,
  DEFAULT_SPACING,
  DEFAULT_TEXT,
  TEXT_VERTICAL_ALIGN
} from '@/common/constants';
import { toggleStroke } from './drawingBox';

/**
 * Handle creating a TextBox into canvas
 */
export const createTextBox = (x, y, width, height, textProperties) => {
  const newText = cloneDeep(TextElement);
  let isHasTextId = !!textProperties?.id;

  const dataObject = {
    id: isHasTextId ? textProperties?.id : uniqueId(),
    type: OBJECT_TYPE.TEXT,
    size: {
      width: isHasTextId ? textProperties.size.width : width,
      height: isHasTextId ? textProperties.size.height : height
    },
    newObject: {
      ...(isHasTextId ? { ...textProperties } : { ...newText }),
      coord: {
        x: isHasTextId ? textProperties?.coord?.x : x,
        y: isHasTextId ? textProperties?.coord?.y : y,
        rotation: isHasTextId
          ? textProperties?.coord?.rotation
          : newText.coord.rotation
      }
    }
  };

  const textProp = toFabricTextProp(dataObject);

  const textVal = dataObject?.newObject?.property?.text || DEFAULT_TEXT.TEXT;
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
    left: x,
    top: y
  });

  const updateTextListeners = canvas => {
    if (text.editingExitedListener) return;
    const onDoneEditText = () => {
      toggleStroke(rect, false);
      canvas.remove(text);
      canvas.remove(rect);
      const grp = new fabric.Group([rect, text], { id: dataObject.id });
      canvas.add(grp);
      addGroupEvents(grp);
    };

    text.on('editing:exited', onDoneEditText);
    text.editingExitedListener = true;
  };

  const handleScaling = e => {
    const target = e.transform?.target;
    if (isEmpty(target)) return;
    text.set('width', target.width);
    if (target.width < text.width) {
      target.set('width', text.width);
    }
    if (target.height < text.height) {
      target.set('height', text.height);
    }
  };

  const handleScaled = e => {
    const target = e.transform?.target;
    if (isEmpty(target)) return;

    const textData = {
      top: target.height * -0.5, // TEXT_VERTICAL_ALIGN.TOP
      left: target.width * -0.5,
      width: target.width
    };

    text.set(textData);

    const {
      width: adjustedWidth,
      height: adjustedHeight
    } = getAdjustedObjectDimension(text, target.width, target.height);

    textVerticalAlignOnAdjust(text, adjustedHeight);

    const strokeWidth = rect.strokeWidth || 1;

    const strokeDashArray = getRectDashes(
      target.width,
      target.height,
      rect.strokeLineCap,
      dataObject.newObject.property.border.strokeWidth
    );

    rect.set({
      top: target.height * -0.5,
      left: target.width * -0.5,
      width: adjustedWidth - strokeWidth,
      height: adjustedHeight - strokeWidth,
      strokeDashArray
    });
  };

  const ungroup = function(g) {
    const { canvas } = g;
    g._restoreObjectsState();
    canvas.remove(g);
    canvas.add(rect);
    canvas.add(text);
    canvas.renderAll();
  };

  const handleDbClick = e => {
    const canvas = e.target.canvas;
    if (isEmpty(canvas)) return;
    ungroup(e.target);
    toggleStroke(rect, true);
    updateTextListeners(canvas);
    canvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
  };

  const addGroupEvents = g => {
    g.on('scaling', handleScaling);
    g.on('scaled', handleScaled);
    g.on('mousedblclick', handleDbClick);
  };

  addGroupEvents(group);

  return { object: group, data: dataObject };
};

/**
 * Get text dimensions { width, height } after auto adjusted by fabric
 * @param {Object} text - the fabric textbox object
 * @param {Number} targetWidth - the target width to compare
 * @param {Number} targetHeight - the target height to compare
 * @returns {Object} dimensions { width, height } that text can use
 */
export const getAdjustedObjectDimension = function(
  text,
  targetWidth,
  targetHeight
) {
  const width = text.width > targetWidth ? text.width : targetWidth;
  const height = text.height > targetHeight ? text.height : targetHeight;
  return { width, height };
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
export const textVerticalAlignOnApplyProperty = function(text) {
  if (!text.group || text.height === text.group.height) return;

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
 * Get all objects within a TextBox Group
 * @param {Object} textObject - the Fabric group object added to canvas
 * @returns {Array} list of objects
 */
export const getObjectsFromTextBox = function(textObject) {
  if (isEmpty(textObject) || !textObject._objects) {
    return [];
  }
  return textObject._objects || [];
};

/**
 * Handle update fabric object rendered on canvas
 *
 * @param {Object}  textObject  the object to be updated
 */
const applyTextProperties = function(textObject, prop) {
  if (isEmpty(textObject) || !textObject.canvas) {
    return;
  }
  const canvas = textObject.canvas;
  const text = getObjectsFromTextBox(textObject)[1];
  if (!text) return;

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

  if (!isEmpty(textProp['verticalAlign'])) {
    textVerticalAlignOnApplyProperty(text);
  }

  if (!isEmpty(prop['shadow'])) {
    applyShadowToObject(text, prop['shadow']);
  }

  canvas.renderAll();
};

/**
 * Handle update fabric object rendered on canvas
 *
 * @param {Object}  textObject  the object to be updated
 */
const applyTextRectProperties = function(textObject, prop, groupSelected) {
  if (isEmpty(textObject) || !textObject.canvas) {
    return;
  }
  const canvas = textObject.canvas;
  const rect = getObjectsFromTextBox(textObject)[0];
  if (!rect) return;

  const rectProp = toFabricTextBorderProp(prop);
  const keyRect = Object.keys(rectProp);
  if (
    groupSelected &&
    (keyRect.includes('strokeWidth') || keyRect.includes('strokeLineCap'))
  ) {
    const { strokeWidth } = rectProp;
    const strokeWidthVal = strokeWidth || rect.strokeWidth;
    rect.set({
      ...rect,
      width: groupSelected.width - strokeWidthVal,
      height: groupSelected.height - strokeWidthVal
    });
  }

  Object.keys(rectProp).forEach(k => {
    rect.set(k, rectProp[k]);
  });

  if (!isEmpty(prop['shadow'])) {
    applyShadowToObject(rect, prop['shadow']);
  }

  canvas.renderAll();
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
  if (!dropShadow) {
    return null;
  }

  const clr = Color(shadowColor)
    .alpha(shadowOpacity)
    .toString();

  const adjustedAngle = (shadowAngle + 180) % 360;
  const rad = (adjustedAngle * Math.PI) / 180;

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
 * @param {Object} fabricObject
 * @param {Object} shadowConfig - the shadow config by user, contains
 * { dropShadow, shadowBlur, shadowOffset, shadowOpacity, shadowAngle, shadowColor }
 */
const applyShadowToObject = function(fabricObject, shadowConfig) {
  if (isEmpty(fabricObject) || isEmpty(shadowConfig)) return;
  const shadow = getShadowBaseOnConfig(shadowConfig);
  fabricObject.set({ shadow });
};

export const applyTextBoxProperties = function(
  textObject,
  prop,
  groupSelected
) {
  applyTextProperties(textObject, prop);
  applyTextRectProperties(textObject, prop, groupSelected);
};
