import { cloneDeep, merge } from 'lodash';

import {
  addObject,
  addObjects,
  deleteObjects,
  setBackgrounds,
  setBookInfo
} from '@/common/store';

import {
  isHalfSheet,
  isHalfLeft,
  isFullBackground,
  isEmpty
} from '@/common/utils';

import { OBJECT_TYPE, SHEET_TYPE } from '@/common/constants';
import PRINT from './const';

export const mutations = {
  [PRINT._MUTATES.SET_BOOK_ID](state, { bookId }) {
    state.book.id = bookId;
  },
  [PRINT._MUTATES.SET_DEFAULT_THEME_ID](state, { themeId }) {
    state.book.defaultThemeId = themeId;
  },
  [PRINT._MUTATES.SET_SECTIONS_SHEETS](state, { sectionsSheets }) {
    state.sections = sectionsSheets.map(s => {
      const section = {
        ...s,
        sheetIds: s.sheets.map(sheet => sheet.id)
      };

      delete section.sheets;

      return section;
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
  [PRINT._MUTATES.SET_OBJECTS](state, { objectList }) {
    if (objectList.length === 0) {
      state.objectIds = [];
      state.objects = {};
      return;
    }

    const objects = {};
    const objectIds = [];

    objectList.forEach(o => {
      if (o.type === OBJECT_TYPE.BACKGROUND) return;

      objectIds.push(o.id);
      objects[o.id] = o;
    });

    state.objectIds = objectIds;
    state.objects = objects;
  },
  [PRINT._MUTATES.SET_CURRENT_SHEET_ID](state, { id }) {
    state.currentSheetId = id;
  },
  [PRINT._MUTATES.SET_BACKGROUND](state, { background }) {
    if (isEmpty(background)) {
      state.background.left = {};
      state.background.right = {};

      return;
    }

    if (isFullBackground(background)) {
      background.isLeftPage = true;

      state.background.left = background;
      state.background.right = {};

      return;
    }

    if (!isHalfSheet(state.sheets[state.currentSheetId])) {
      const position = background.isLeftPage ? 'left' : 'right';

      if (isFullBackground(state.background.left)) {
        state.background.left = {};
      }

      state.background[position] = background;

      return;
    }

    const isSheetLeft = isHalfLeft(state.sheets[state.currentSheetId]);

    background.isLeftPage = isSheetLeft;

    state.background.left = isSheetLeft ? background : {};
    state.background.right = isSheetLeft ? {} : background;
  },
  [PRINT._MUTATES.SET_CURRENT_OBJECT_ID](state, { id }) {
    state.currentObjectId = id;
  },
  [PRINT._MUTATES.ADD_OBJECT]: addObject,
  [PRINT._MUTATES.ADD_OBJECTS]: addObjects,
  [PRINT._MUTATES.SET_PROP](state, { prop }) {
    if (!state.currentObjectId) return;

    const currentProps = cloneDeep(state.objects[state.currentObjectId]);

    merge(currentProps, prop);

    state.objects[state.currentObjectId] = currentProps;
  },
  [PRINT._MUTATES.SET_PROP_BY_ID](state, { id, prop }) {
    if (!id) return;

    const currentProps = cloneDeep(state.objects[id]);

    merge(currentProps, prop);

    state.objects[id] = currentProps;
  },
  /**
   * to set prop for mulitple objects
   * @param {Object} state the stoer data
   * @param {Array} data [{id: ObjectID, prop: {propName: value}}]
   */
  [PRINT._MUTATES.SET_PROP_OF_MULIPLE_OBJECTS](state, { data }) {
    data.forEach(({ id, prop }) => {
      const currentProps = cloneDeep(state.objects[id]);
      merge(currentProps, prop);

      state.objects[id] = currentProps;
    });
  },

  [PRINT._MUTATES.DELETE_OBJECTS]: deleteObjects,
  [PRINT._MUTATES.UPDATE_TRIGGER_BACKGROUND_CHANGE](state) {
    state.triggerChange.background = !state.triggerChange.background;
  },
  [PRINT._MUTATES.UPDATE_SHEET_VISITED](state, { sheetId }) {
    const currentSheet = state.sheets[sheetId];
    currentSheet.isVisited = true;
  },
  [PRINT._MUTATES.UPDATE_SHEET_THUMBNAIL](state, { thumbnailUrl, sheetId }) {
    state.sheets[sheetId].thumbnailUrl = thumbnailUrl;
  },
  [PRINT._MUTATES.REORDER_OBJECT_IDS](state, { oldIndex, newIndex }) {
    const [id] = state.objectIds.splice(oldIndex, 1);
    state.objectIds.splice(newIndex, 0, id);
  },
  [PRINT._MUTATES.SET_SHEET_DATA](
    state,
    { layoutId, themeId, previewImageUrl }
  ) {
    state.sheets[state.currentSheetId].layoutId = layoutId;
    state.sheets[state.currentSheetId].themeId = themeId;
    state.sheets[state.currentSheetId].thumbnailUrl = previewImageUrl;
  },
  [PRINT._MUTATES.REMOVE_OBJECTS](state, { currentPosition }) {
    Object.values(state.objects).forEach(obj => {
      if (obj.position === currentPosition) {
        delete state.objects[obj.id];
      }
    });
  },
  [PRINT._MUTATES.SET_BACKGROUND_PROP](state, { isLeft, prop }) {
    const position = isLeft ? 'left' : 'right';

    const currentProps = cloneDeep(state.background[position]);

    merge(currentProps, prop);

    state.background[position] = currentProps;
  },
  [PRINT._MUTATES.DELETE_BACKGROUND](state, { isLeft }) {
    const position = isLeft ? 'left' : 'right';

    state.background[position] = {};
  },
  [PRINT._MUTATES.SET_SHEET_LINK_STATUS](state, { link, sheetId }) {
    state.sheets[sheetId].link = link;
  },
  [PRINT._MUTATES.SET_PAGE_INFO](state, { pageInfo }) {
    state.book.pageInfo = pageInfo;
  },
  [PRINT._MUTATES.SET_STATUS_PAGE_NUMBER](state, isNumberOn) {
    state.book.pageInfo.isNumberingOn = isNumberOn;
    Object.values(state.sheets).forEach(sheet => {
      const { spreadInfo, type } = sheet;
      if (type === SHEET_TYPE.FRONT_COVER) {
        spreadInfo.isRightNumberOn = isNumberOn;
      }
      if (type === SHEET_TYPE.BACK_COVER) {
        spreadInfo.isLeftNumberOn = isNumberOn;
      }
      if (type === SHEET_TYPE.NORMAL) {
        spreadInfo.isLeftNumberOn = isNumberOn;
        spreadInfo.isRightNumberOn = isNumberOn;
      }
    });
  },
  [PRINT._MUTATES.UPDATE_SPREAD_INFO](state, { spreadInfo }) {
    state.sheets[state.currentSheetId].spreadInfo = {
      ...state.sheets[state.currentSheetId].spreadInfo,
      ...spreadInfo
    };
  },
  [PRINT._MUTATES.CLEAR_BACKGROUNDS](state, pageEmpty) {
    if (pageEmpty) {
      state.background[pageEmpty] = {};
      return;
    }
    state.background.left = {};
    state.background.right = {};
  },
  [PRINT._MUTATES.SET_SHEET_MEDIA](state, { media }) {
    state.sheets[state.currentSheetId].media = media;
  },
  [PRINT._MUTATES.SET_BACKGROUNDS]: setBackgrounds,
  [PRINT._MUTATES.SET_BOOK_INFO]: setBookInfo
};
