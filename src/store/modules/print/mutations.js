import { cloneDeep, merge } from 'lodash';
import { isHalfSheet, isHalfLeft, isFullBackground } from '@/common/utils';

import { OBJECT_TYPE } from '@/common/constants';
import PRINT from './const';

export const mutations = {
  [PRINT._MUTATES.SET_BOOK_ID](state, { bookId }) {
    state.book.id = bookId;
  },
  [PRINT._MUTATES.SET_DEFAULT_THEME_ID](state, { themeId }) {
    state.book.defaultThemeId = themeId;
  },
  [PRINT._MUTATES.SET_SECTIONS_SHEETS](state, { sectionsSheets }) {
    state.sections = sectionsSheets;
  },
  [PRINT._MUTATES.SET_SECTIONS_SHEETS_EDIT](state, { sectionsSheets }) {
    state.sections = sectionsSheets.map(section => {
      return {
        ...section,
        sheets: section.sheets.map(sheet => sheet.id)
      };
    });

    const sheets = {};

    sectionsSheets.forEach(section => {
      section.sheets.forEach(sheet => {
        sheets[sheet.id] = { ...sheet, sectionId: section.id };
      });
    });

    state.sheets = sheets;
  },
  [PRINT._MUTATES.SET_OBJECTS](state, { objectList }) {
    state.objectIds = objectList.map(o => o.id);

    const objects = {};

    objectList.forEach(o => {
      if (o.type === OBJECT_TYPE.BACKGROUND) return;

      objects[o.id] = o;
    });

    state.objects = objects;
  },
  [PRINT._MUTATES.SET_CURRENT_SHEET_ID](state, { id }) {
    state.currentSheetId = id;
  },
  [PRINT._MUTATES.SET_BACKGROUNDS](state, { background }) {
    if (isFullBackground(background)) {
      background.isLeft = true;

      // adding z-index to background
      background.zIndex = 0;

      state.background.left = background;
      state.background.right = {};

      return;
    }

    if (!isHalfSheet(state.sheets[state.currentSheetId])) {
      const position = background.isLeft ? 'left' : 'right';

      state.background[position] = background;

      return;
    }

    const isSheetLeft = isHalfLeft(state.sheets[state.currentSheetId]);

    background.isLeft = isSheetLeft;

    // adding z-index to background
    background.zIndex = isSheetLeft ? 0 : 1;

    state.background.left = isSheetLeft ? background : {};
    state.background.right = isSheetLeft ? {} : background;
  },
  [PRINT._MUTATES.SET_CURRENT_OBJECT_ID](state, { id }) {
    state.currentObjectId = id;
  },
  [PRINT._MUTATES.ADD_OBJECT](state, { id, newObject }) {
    state.objectIds.push(id);

    state.objects[id] = newObject;
  },
  [PRINT._MUTATES.SET_PROP](state, { prop }) {
    const currentProps = cloneDeep(state.objects[state.currentObjectId]);

    merge(currentProps, prop);

    state.objects[state.currentObjectId] = currentProps;
  },
  [PRINT._MUTATES.SET_PROP_BY_ID](state, { id, prop }) {
    const currentProps = cloneDeep(state.objects[id]);

    merge(currentProps, prop);
    state.objects[id] = currentProps;
  },
  [PRINT._MUTATES.DELETE_OBJECTS](state, { ids }) {
    ids.forEach(id => {
      const index = state.objectIds.indexOf(id);

      if (index >= 0) {
        state.objectIds.splice(index, 1);
      }

      delete state.objects[id];
    });
  },
  [PRINT._MUTATES.UPDATE_TRIGGER_TEXT_CHANGE](state) {
    state.triggerChange.text = !state.triggerChange.text;
  },
  [PRINT._MUTATES.UPDATE_TRIGGER_BACKGROUND_CHANGE](state) {
    state.triggerChange.background = !state.triggerChange.background;
  },
  [PRINT._MUTATES.UPDATE_TRIGGER_CLIPART_CHANGE](state) {
    state.triggerChange.clipArt = !state.triggerChange.clipArt;
  },
  [PRINT._MUTATES.UPDATE_TRIGGER_SHAPE_CHANGE](state) {
    state.triggerChange.shape = !state.triggerChange.shape;
  }
};
