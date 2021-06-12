import { fabric } from 'fabric';
import { cloneDeep, uniqueId } from 'lodash';
import { TextElement } from '@/common/models';

import {
  toFabricTextProp,
  toFabricTextBorderProp,
  isEmpty,
  getCoverPagePrintSize,
  getPagePrintSize,
  toFabricImageProp,
  selectLatestObject,
  deleteSelectedObjects,
  ptToPx,
  scaleSize
} from '@/common/utils';

import {
  TEXT_CASE,
  OBJECT_TYPE,
  DEFAULT_SPACING,
  DEFAULT_TEXT
} from '@/common/constants';
import { STROKE_WIDTH } from '../constants/config';

/**
 * Handle creating a TextBox into canvas
 */
export const createTextBox = (x, y, width, height) => {
  const newText = cloneDeep(TextElement);
  const id = uniqueId();
  const dataObject = {
    id,
    type: OBJECT_TYPE.TEXT,
    size: {
      ...newText.size,
      width,
      height
    },
    newObject: {
      ...newText,
      coord: {
        ...newText.coord,
        x,
        y
      }
    }
  };

  const textProp = toFabricTextProp(dataObject);

  const text = new fabric.Textbox(DEFAULT_TEXT.TEXT, {
    ...textProp,
    id,
    left: 0,
    top: 0,
    width,
    originX: 'left',
    originY: 'top'
  });
  // text height must be updated after width
  if (height > text.height) {
    text.height = height;
  }

  const updateTextListeners = canvas => {
    text.__eventListeners = {};

    const onDoneEditText = () => {
      canvas.remove(text);
      canvas.remove(rect);
      const grp = new fabric.Group([rect, text], { id });
      canvas.add(grp);
      addGroupEvents(grp);
    };

    text.on('editing:exited', onDoneEditText);
  };
  const strokeWidth = scaleSize(STROKE_WIDTH);

  const borderProp = toFabricTextBorderProp(dataObject);
  const rect = new fabric.Rect({
    ...borderProp,
    type: OBJECT_TYPE.RECT,
    id,
    width: width,
    height: height,
    left: 0,
    top: 0,
    originX: 'left',
    originY: 'top'
  });

  const group = new fabric.Group([rect, text], {
    id,
    left: x,
    top: y
  });

  const handleScale = e => {
    const target = e.transform?.target;
    if (target) {
      const newData = {
        top: (-1 * target.height) / 2,
        left: (-1 * target.width) / 2,
        width: target.width,
        height: target.height
      };
      text.set(newData);
      text.set('height', target.height);
      rect.set({
        ...newData,
        width: target.width - strokeWidth,
        height: target.height - strokeWidth
      });
    }
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
    if (canvas) {
      ungroup(e.target);
      updateTextListeners(canvas);
      canvas.setActiveObject(text);
      text.enterEditing();
      text.selectAll();
    }
  };

  const addGroupEvents = g => {
    g.on('scaled', handleScale);
    g.on('mousedblclick', handleDbClick);
  };

  addGroupEvents(group);

  return { object: group, data: dataObject };
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

  if (isEmpty(prop['textCase'])) {
    canvas.renderAll();
    return;
  }

  const textString = text.get('text');

  if (isEmpty(textString)) {
    canvas.renderAll();
    return;
  }

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
    const changedText = textString
      .split(' ')
      .map(t => `${t.charAt(0).toUpperCase()}${t.toLowerCase().slice(1)}`)
      .join(' ');

    text.set('text', changedText);
  }
  canvas.renderAll();
};

/**
 * Handle update fabric object rendered on canvas
 *
 * @param {Object}  textObject  the object to be updated
 */
const applyTextRectProperties = function(textObject, prop) {
  if (isEmpty(textObject) || !textObject.canvas) {
    return;
  }
  const canvas = textObject.canvas;
  const rect = getObjectsFromTextBox(textObject)[0];
  if (!rect) return;

  const rectProp = toFabricTextBorderProp(prop);
  Object.keys(rectProp).forEach(k => {
    rect.set(k, rectProp[k]);
  });
  canvas.renderAll();
};

export const applyTextBoxProperties = function(textObject, prop) {
  applyTextProperties(textObject, prop);
  applyTextRectProperties(textObject, prop);
};
