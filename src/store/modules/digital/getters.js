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
  [DIGITAL._GETTERS.TRIGGER_APPLY_LAYOUT]: ({ triggerChange }) =>
    triggerChange.applyLayout,
  [DIGITAL._GETTERS.GET_OBJECTS]: ({ objects }) => {
    return objects;
  },
  [DIGITAL._GETTERS.SHEET_LAYOUT]: ({ objects, objectIds, background }) => {
    return [
      ...Object.values(background).filter(bg => !isEmpty(bg)),
      ...objectIds.map(id => objects[id])
    ];
  },
  [DIGITAL._GETTERS.GET_SHEETS]: ({ sheets }) => {
    return sheets;
  },
  [DIGITAL._GETTERS.BACKGROUNDS_NO_LAYOUT]: ({ background }) => {
    return isEmpty(background.left.backgroundType) ? null : background.left;
  },
  [DIGITAL._GETTERS.BACKGROUNDS_PROPERTIES]: ({ background }) => {
    return isEmpty(background.left)
      ? { isSingle: true, isEmpty: true }
      : { isSingle: true, background: background.left };
  },
  [DIGITAL._GETTERS.SECTIONS_SHEETS]: ({ sections, sheets }) => {
    return sections.map(section => {
      return {
        ...section,
        sheets: section.sheetIds.map(sheetId => sheets[sheetId])
      };
    });
  },
  [DIGITAL._GETTERS.DEFAULT_THEME_ID]: ({ book }) => {
    return book.defaultThemeId;
  },
  [DIGITAL._GETTERS.GET_FRAMES_WIDTH_IDS]: ({ frames, frameIds }) => {
    return frameIds.map(id => ({ id, frame: frames[id] }));
  },
  [DIGITAL._GETTERS.CURRENT_FRAME_ID]: ({ currentFrameId }) => {
    return currentFrameId;
  },
  [DIGITAL._GETTERS.CURRENT_FRAME]: ({ frames, currentFrameId }) => {
    return frames[currentFrameId];
  },
  [DIGITAL._GETTERS.TOTAL_OBJECT]: ({ objectIds }) => {
    return objectIds.length;
  },
  [DIGITAL._GETTERS.CURRENT_SECTION]: ({ sections, currentSheetId }) => {
    if (isEmpty(currentSheetId)) return '';

    return sections.find(s => s.sheetIds.includes(currentSheetId));
  },
  [DIGITAL._GETTERS.GET_FIRST_FRAME_THUMBNAIL]: state => {
    if (isEmpty(state.frameIds)) return;
    return state.frames[state.frameIds[0]].previewImageUrl;
  },
  [DIGITAL._GETTERS.GET_DATA_EDIT_SCREEN]: ({
    book,
    sheets,
    frames,
    frameIds
  }) => sheetId => {
    const framesArray = frameIds.map(id => ({ id, frame: frames[id] }));
    const data = {
      defaultThemeId: book.defaultThemeId,
      sheet: sheets[sheetId],
      frames: framesArray
    };
    return data;
  },
  [DIGITAL._GETTERS.GET_SHEET_MEDIA]: ({ sheets, currentSheetId }) => {
    const media = sheets[currentSheetId]?.media;
    return isEmpty(media) ? [] : media;
  }
};
