import { cloneDeep, merge } from 'lodash';

import { OBJECT_TYPE } from '@/common/constants';
import DIGITAL from './const';

export const mutations = {
  [DIGITAL._MUTATES.SET_BOOK_ID](state, { bookId }) {
    state.book.id = bookId;
  },
  [DIGITAL._MUTATES.SET_DEFAULT_THEME_ID](state, { themeId }) {
    state.book.defaultThemeId = themeId;
  },
  [DIGITAL._MUTATES.SET_SECTIONS_SHEETS](state, { sectionsSheets }) {
    state.sections = sectionsSheets.map(section => {
      return {
        ...section,
        sheets: section.sheets.map(sheet => sheet.id)
      };
    });

    const sheets = {};

    sectionsSheets.forEach(section => {
      section.sheets.forEach(sheet => {
        sheets[sheet.id] = {
          ...sheet,
          sectionId: section.id
        };
      });
    });

    state.sheets = sheets;
  },
  [DIGITAL._MUTATES.SET_OBJECTS](state, { objectList }) {
    if (objectList.length === 0) {
      state.objects = {};
      state.objectIds = [];
      return;
    }
    state.objectIds = objectList.map(o => o.id);

    const objects = {};

    objectList.forEach(o => {
      if (o.type === OBJECT_TYPE.BACKGROUND) return;

      objects[o.id] = o;
    });

    state.objects = objects;
  },
  [DIGITAL._MUTATES.SET_CURRENT_SHEET_ID](state, { id }) {
    state.currentSheetId = id;
  },
  [DIGITAL._MUTATES.SET_BACKGROUNDS](state, { background = {} }) {
    state.background.left = background;
  },
  [DIGITAL._MUTATES.SET_CURRENT_OBJECT_ID](state, { id }) {
    state.currentObjectId = id;
  },
  [DIGITAL._MUTATES.ADD_OBJECT](state, { id, newObject }) {
    state.objectIds.push(id);

    state.objects[id] = newObject;
  },
  [DIGITAL._MUTATES.SET_PROP](state, { prop }) {
    const currentProps = cloneDeep(state.objects[state.currentObjectId]);

    merge(currentProps, prop);

    state.objects[state.currentObjectId] = currentProps;
  },
  [DIGITAL._MUTATES.SET_PROP_BY_ID](state, { id, prop }) {
    const currentProps = cloneDeep(state.objects[id]);

    merge(currentProps, prop);

    state.objects[id] = currentProps;
  },

  [DIGITAL._MUTATES.SET_PROP_OF_MULIPLE_OBJECTS](state, { data }) {
    data.forEach(({ id, prop }) => {
      const currentProps = cloneDeep(state.objects[id]);
      merge(currentProps, prop);

      state.objects[id] = currentProps;
    });
  },

  [DIGITAL._MUTATES.DELETE_OBJECTS](state, { ids }) {
    ids.forEach(id => {
      const index = state.objectIds.indexOf(id);

      if (index >= 0) {
        state.objectIds.splice(index, 1);
      }

      delete state.objects[id];
    });
  },
  [DIGITAL._MUTATES.UPDATE_TRIGGER_TEXT_CHANGE](state) {
    state.triggerChange.text = !state.triggerChange.text;
  },
  [DIGITAL._MUTATES.UPDATE_TRIGGER_BACKGROUND_CHANGE](state) {
    state.triggerChange.background = !state.triggerChange.background;
  },
  [DIGITAL._MUTATES.UPDATE_TRIGGER_CLIPART_CHANGE](state) {
    state.triggerChange.clipArt = !state.triggerChange.clipArt;
  },
  [DIGITAL._MUTATES.UPDATE_TRIGGER_SHAPE_CHANGE](state) {
    state.triggerChange.shape = !state.triggerChange.shape;
  },
  [DIGITAL._MUTATES.UPDATE_SHEET_VISITED](state, { sheetId }) {
    const currentSheet = state.sheets[sheetId];
    currentSheet.isVisited = true;
  },
  [DIGITAL._MUTATES.UPDATE_SHEET_THUMBNAIL](state, { thumbnailUrl, sheetId }) {
    state.sheets[sheetId].thumbnailUrl = thumbnailUrl;
  },
  [DIGITAL._MUTATES.REORDER_OBJECT_IDS](state, { oldIndex, newIndex }) {
    const [id] = state.objectIds.splice(oldIndex, 1);
    state.objectIds.splice(newIndex, 0, id);
  },
  [DIGITAL._MUTATES.SET_SHEET_DATA](
    state,
    { layoutId, themeId, previewImageUrl }
  ) {
    state.sheets[state.currentSheetId].layoutId = layoutId;
    state.sheets[state.currentSheetId].themeId = themeId;
    state.sheets[state.currentSheetId].thumbnailUrl = previewImageUrl;
  },
  [DIGITAL._MUTATES.REMOVE_OBJECTS](state, { currentPosition }) {
    Object.values(state.objects).forEach(obj => {
      if (obj.position === currentPosition) {
        delete state.objects[obj.id];
      }
    });
  },
  [DIGITAL._MUTATES.SET_BACKGROUND_PROP](state, { prop }) {
    const currentProps = cloneDeep(state.background.left);

    merge(currentProps, prop);

    state.background.left = currentProps;
  },
  [DIGITAL._MUTATES.DELETE_BACKGROUND](state) {
    state.background.left = {};
  },

  [DIGITAL._MUTATES.SET_FRAMES](state, { framesList }) {
    if (framesList.length === 0) {
      state.frames = {};
      state.frameIds = [];
      state.currentFrameId = 0;
      return;
    }
    state.frameIds = framesList.map(f => f.id);

    const frames = {};

    framesList.forEach(f => {
      frames[f.id] = f;
    });

    state.frames = frames;
  },
  [DIGITAL._MUTATES.REORDER_FRAME_IDS](state, { oldIndex, newIndex }) {
    const [id] = state.frameIds.splice(oldIndex, 1);
    state.frameIds.splice(newIndex, 0, id);
  },
  [DIGITAL._MUTATES.DELETE_FRAMES](state, { ids }) {
    ids.forEach(id => {
      const index = state.frameIds.indexOf(id);

      if (index >= 0) {
        state.frameIds.splice(index, 1);
      }

      delete state.frames[id];
    });
  },
  [DIGITAL._MUTATES.SET_CURRENT_FRAME_ID](state, { id }) {
    state.currentFrameId = id;
  },
  [DIGITAL._MUTATES.ADD_FRAME](state, { id, newFrame }) {
    state.frameIds.push(id);

    state.frames[id] = newFrame;
  }
};
