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
  [PRINT._MUTATES.SET_CURRENT_SHEET](state, { sheet }) {
    state.currentSheet = sheet;
  },
  [PRINT._MUTATES.SET_BACKGROUNDS](state, { background }) {
    if (isFullBackground(background)) {
      background.isLeft = true;

      state.background.left = background;
      state.background.right = {};

      return;
    }

    if (!isHalfSheet(state.currentSheet)) {
      const position = background.isLeft ? 'left' : 'right';

      state.background[position] = background;

      return;
    }

    const isSheetLeft = isHalfLeft(state.currentSheet);

    background.isLeft = isSheetLeft;

    state.background.left = isSheetLeft ? background : {};
    state.background.right = isSheetLeft ? {} : background;

    /*if (background.isLeft) {
      state.background.right = rightBackground;
    } else {
      state.background.left = leftBackground;
    }*/

    /*const isFullBackground =
      background.pageType === BACKGROUND_PAGE_TYPE.FULL_PAGE.id;

    if (background.pageType === BACKGROUND_PAGE_TYPE.FULL_PAGE.id)
      const isCurrentFullBackground =
        !isEmpty(background.left) &&
        state.background.left.pageType === BACKGROUND_PAGE_TYPE.FULL_PAGE.id;

    const isSheetHalf = isHalfSheet(state.currentSheet);
    const isSheetLeft = isHalfLeft(state.currentSheet);

    const isRemoveAllBackground =
      isSheetHalf || isFullBackground || isCurrentFullBackground;

    const isAddToLeftFullSheet =
      !isSheetHalf && (isFullBackground || background.isLeft);

    const isAddToLeft = isSheetLeft || isAddToLeftFullSheet;

    if (isRemoveAllBackground || isAddToLeft) {
      state.background.left = {};
    }

    if (isRemoveAllBackground || !isAddToLeft) {
      state.background.right = {};
    }

    const leftRight = isAddToLeft ? 'left' : 'right';

    state.background[leftRight] = background;*/
  }
};
