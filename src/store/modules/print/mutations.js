import { merge } from 'lodash';
import { isEmpty } from '@/common/utils';

import PRINT from './const';

export const mutations = {
  [PRINT._MUTATES.SET_BASE_INFO](state, { bookId, sectionId, sheetId }) {
    merge(state.book, { id: bookId, sectionId, sheetId });
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
      merge(sheets, section.sheets);
    });

    state.sheets = sheets;
  },
  [PRINT._MUTATES.SET_OBJECTS](state, { objectList }) {
    state.objectIds = objectList.map(o => o.id);

    const objects = {};

    objectList.forEach(o => (objects[o.id] = o));

    state.objects = objects;
  }
};
