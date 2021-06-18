import { cloneDeep } from 'lodash';
import {
  isEmpty,
  isHalfSheet,
  isHalfLeft,
  isFullBackground
} from '@/common/utils';

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

    state.background.left = isSheetLeft ? background : {};
    state.background.right = isSheetLeft ? {} : background;
  }
};
