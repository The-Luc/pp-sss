import { isEmpty, isHalfSheet, isHalfLeft } from '@/common/utils';

import { BACKGROUND_PAGE_TYPE } from '@/common/constants';

import DIGITAL from './const';

export const getters = {
  [DIGITAL._GETTERS.CURRENT_SHEET]: ({ sheets, currentSheetId }) => {
    const currentSheet = sheets[currentSheetId];

    return isEmpty(currentSheet) ? {} : currentSheet;
  },
  [DIGITAL._GETTERS.TOTAL_BACKGROUND]: ({ background }) => {
    const backgrounds = [background.left, background.right].filter(bg => {
      return !isEmpty(bg);
    });

    return backgrounds.length;
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
    Object.values(background).forEach(bg => {
      if (bg.id) {
        allObjects.push(bg);
      }
    });

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
    return [background.left, background.right].filter(bg => {
      return !isEmpty(bg.backgroundType);
    });
  },
  [DIGITAL._GETTERS.BACKGROUNDS_PROPERTIES]: ({
    currentSheetId,
    sheets,
    background
  }) => {
    const existedBackground = [background.left, background.right].filter(
      bg => !isEmpty(bg)
    );

    if (isEmpty(existedBackground)) {
      return { isSingle: true, isEmpty: true };
    }

    const isFull =
      background.left.pageType === BACKGROUND_PAGE_TYPE.FULL_PAGE.id;

    if (isFull) {
      return {
        isSingle: true,
        background: background.left
      };
    }

    const isHalf = isHalfSheet(sheets[currentSheetId]);
    const position = isHalfLeft(sheets[currentSheetId]) ? 'left' : 'right';

    if (isHalf) {
      return {
        isSingle: true,
        background: background[position]
      };
    }

    return {
      isSingle: false,
      left: background.left,
      right: background.right
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
