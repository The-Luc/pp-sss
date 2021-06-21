import { pick } from 'lodash';

import { isEmpty } from '@/common/utils';
import PRINT from './const';

export const getters = {
  [PRINT._GETTERS.CURRENT_SHEET]: ({ sheets, currentSheetId }) => {
    const currentSheet = sheets[currentSheetId];

    return isEmpty(currentSheet) ? {} : currentSheet;
  },
  [PRINT._GETTERS.BACKGROUNDS]: ({ background }) => {
    return [background.left, background.right].filter(bg => {
      return !isEmpty(bg);
    });
  },
  [PRINT._GETTERS.CURRENT_OBJECT]: ({ objects, currentObjectId }) => {
    const currentObject = objects[currentObjectId];

    return isEmpty(currentObject) ? {} : currentObject;
  },
  [PRINT._GETTERS.CURRENT_OBJECT_ID]: ({ currentObjectId }) => {
    return currentObjectId;
  },
  [PRINT._GETTERS.OBJECT_BY_ID]: ({ objects }) => id => objects[id],
  [PRINT._GETTERS.SELECT_PROP_CURRENT_OBJECT]: ({
    objects,
    currentObjectId
  }) => prop => {
    const propValue = objects[currentObjectId]?.[prop];

    return isEmpty(propValue) ? null : propValue;
  },
  [PRINT._GETTERS.SELECT_PROP_OBJECT_BY_ID]: ({ objects }) => ({
    id,
    prop
  }) => {
    const propValue = objects[id]?.[prop];

    return isEmpty(propValue) ? null : propValue;
  },
  [PRINT._GETTERS.TRIGGER_TEXT_CHANGE]: ({ triggerChange }) =>
    triggerChange.text,
  [PRINT._GETTERS.TRIGGER_BACKGROUND_CHANGE]: ({ triggerChange }) =>
    triggerChange.background,
  [PRINT._GETTERS.TRIGGER_CLIPART_CHANGE]: ({ triggerChange }) =>
    triggerChange.clipArt,
  [PRINT._GETTERS.TRIGGER_SHAPE_CHANGE]: ({ triggerChange }) =>
    triggerChange.shape,
  [PRINT._GETTERS.GET_OBJECTS_BY_SHEET_ID]: ({
    currentSheetId,
    objects,
    sheets
  }) => sheetId => {
    const sheet = sheets[currentSheetId];
    if (sheet) {
      // const sheetObjIds = sheet.objects;
      // const res = [];
      // sheetObjIds.forEach(objId => {
      //   // const realId = objId.split('-')[1];
      //   res.push(objects[objId]);
      // });
      return sheet.objects;
    }
    return [];
  },
  [PRINT._GETTERS.SHEET_LAYOUT]: ({ sheets, objects }) => sheetId => {
    const sheet = sheets[sheetId];

    const sheetLayoutId = sheet?.layoutId;
    if (!sheetLayoutId) {
      return {};
    }
    const sheetObjIds = sheet.objects;
    const sheetLayout = new Array([], []);
    if (sheetObjIds.length > 0) {
      sheetObjIds.forEach((objId, index) => {
        const data = pick(objects, ...objId);
        sheetLayout[index] = Object.values(data);
      });
    }
    return sheetLayout;
  },
  [PRINT._GETTERS.GET_SHEETS]: ({ sheets }) => {
    return sheets;
  }
};
