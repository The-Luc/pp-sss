import { isEmpty } from '@/common/utils';

import DIGITAL from './const';

export const getters = {
  [DIGITAL._GETTERS.CURRENT_SHEET]: ({ sheets, currentSheetId }) => {
    const currentSheet = sheets[currentSheetId];

    return isEmpty(currentSheet) ? {} : currentSheet;
  },
  [DIGITAL._GETTERS.TOTAL_BACKGROUND]: ({ background }) => {
    return isEmpty(background.left) ? 0 : 1;
  },
  [DIGITAL._GETTERS.CURRENT_OBJECT]: ({ objects, currentObjectId }) => {
    const currentObject = objects[currentObjectId];

    return isEmpty(currentObject) ? {} : currentObject;
  },
  [DIGITAL._GETTERS.CURRENT_OBJECT_ID]: ({ currentObjectId }) => {
    return currentObjectId;
  },
  [DIGITAL._GETTERS.OBJECT_BY_ID]: ({ objects }) => id => objects[id],
  [DIGITAL._GETTERS.SELECT_PROP_CURRENT_OBJECT]: ({
    objects,
    currentObjectId
  }) => prop => {
    const propValue = objects[currentObjectId]?.[prop];

    return isEmpty(propValue) ? null : propValue;
  },
  [DIGITAL._GETTERS.SELECT_PROP_OBJECT_BY_ID]: ({ objects }) => ({
    id,
    prop
  }) => {
    const propValue = objects[id]?.[prop];

    return isEmpty(propValue) ? null : propValue;
  },
  [DIGITAL._GETTERS.TRIGGER_TEXT_CHANGE]: ({ triggerChange }) =>
    triggerChange.text,
  [DIGITAL._GETTERS.TRIGGER_BACKGROUND_CHANGE]: ({ triggerChange }) =>
    triggerChange.background,
  [DIGITAL._GETTERS.TRIGGER_CLIPART_CHANGE]: ({ triggerChange }) =>
    triggerChange.clipArt,
  [DIGITAL._GETTERS.TRIGGER_SHAPE_CHANGE]: ({ triggerChange }) =>
    triggerChange.shape,
  [DIGITAL._GETTERS.GET_OBJECTS]: ({ objects }) => {
    return objects;
  },
  [DIGITAL._GETTERS.SHEET_LAYOUT]: ({
    sheets,
    objects,
    currentSheetId,
    background
  }) => {
    const sheet = sheets[currentSheetId];

    if (!sheet?.layoutId) {
      return [];
    }

    const allObjects = [];

    if (!isEmpty(background.left.id)) allObjects.push(background.left);

    Object.values(objects).forEach(obj => {
      if (obj.id) {
        allObjects.push(obj);
      }
    });

    return allObjects;
  },
  [DIGITAL._GETTERS.GET_SHEETS]: ({ sheets }) => {
    return sheets;
  },
  [DIGITAL._GETTERS.BACKGROUNDS_NO_LAYOUT]: ({ background }) => {
    return isEmpty(background.left.backgroundType) ? [background.left] : [];
  },
  [DIGITAL._GETTERS.BACKGROUNDS_PROPERTIES]: ({ background }) => {
    return {
      isSingle: false,
      left: background?.left,
      right: {}
    };
  },
  [DIGITAL._GETTERS.SECTIONS_SHEETS]: ({ sections, sheets }) => {
    return sections.map(section => {
      return {
        ...section,
        sheets: section.sheets.map(sheetId => sheets[sheetId])
      };
    });
  }
};
