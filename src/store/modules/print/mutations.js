import { cloneDeep, merge, omit, pick } from 'lodash';
import { isHalfSheet, isHalfLeft, isFullBackground } from '@/common/utils';

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
        sheets[sheet.id] = {
          ...sheet,
          ...state.sheets[sheet.id],
          sectionId: section.id
        };
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
  },
  [PRINT._MUTATES.UPDATE_SHEET_THEME_LAYOUT](
    state,
    { sheetId, themeId, layout, pagePosition }
  ) {
    const layoutPages = cloneDeep(layout.pages);
    // Assign unique id to objects
    const pagesWithObjectId = layoutPages.map(page => ({
      objects: page.objects.map(obj => ({
        ...obj,
        id: `${sheetId}-${obj.id}`
      }))
    }));
    const layoutObj = cloneDeep(layout);
    layoutObj.pages = pagesWithObjectId;

    const currentSheet = state.sheets[sheetId];
    const sheetObj = cloneDeep(currentSheet);
    // Reset objects of current sheet to avoid trash data
    const isExitLayout = !!sheetObj.layoutId;
    if (isExitLayout && !pagePosition) {
      sheetObj.objects.forEach(objIds => {
        state.objects = omit(state.objects, [...objIds]);
      });
    }

    const singleLayoutSelected = layoutObj?.pages[0]; // For single layout, data object always first item
    let currentPosition = pagePosition; // Check whether user has add single page or not. Value: left or right with single page else undefine
    if (sheetObj.type === SHEET_TYPE.FRONT_COVER) {
      // Front cover always has the right page
      currentPosition = 'right';
    }

    if (sheetObj.type === SHEET_TYPE.BACK_COVER) {
      // Back cover always has the left page
      currentPosition = 'left';
    }

    let sheetLeftLayout = currentSheet.objects[0] || []; // List object's id
    let sheetRightLayout = currentSheet.objects[1] || [];

    if (sheetLeftLayout.length > 0) {
      // Convert object's id from string into array to object by object id to compare data
      const objectKeys = Object.keys(pick(state.objects, [...sheetLeftLayout]));
      sheetLeftLayout = {
        objects: objectKeys.map(key => state.objects[key])
      };
    }

    if (sheetRightLayout.length > 0) {
      // Convert object from string to object by object id to compare data
      const objectKeys = Object.keys(
        pick(state.objects, [...sheetRightLayout])
      );
      sheetRightLayout = {
        objects: objectKeys.map(key => state.objects[key])
      };
    }

    let pages = new Array(2);
    pages[0] = sheetLeftLayout; // Assign left layout of current sheet to first item
    pages[1] = sheetRightLayout; // Assign right layout of current sheet to first item
    let initPages = pages;
    if (currentPosition) {
      // User select single page type
      // Check user apply layout to left or right of page
      const indexPage = currentPosition === 'left' ? 0 : 1;
      initPages = pages.map((page, index) => {
        if (index === indexPage) {
          return singleLayoutSelected;
        }
        return {
          ...page
        };
      });
    } else {
      // Apply whole layout's pages selected
      initPages = layoutObj.pages;
    }
    // Update objects state
    let objects = {};
    const objIds = new Array([], []);
    initPages.forEach((page, index) => {
      if (page?.objects) {
        page?.objects.forEach(obj => {
          objIds[index].push(obj.id);
          objects[obj.id] = {
            ...obj
          };
        });
      }
    });
    state.objects = {
      ...state.objects,
      ...objects
    };

    // Update sheet fields
    state.sheets[sheetId].layoutId = layout.id;
    state.sheets[sheetId].themeId = themeId;
    state.sheets[sheetId].objects = objIds;
    state.sheets[sheetId].thumbnailUrl = layout.previewImageUrl;
  },
  [PRINT._MUTATES.UPDATE_SHEET_VISITED](state, { sheetId }) {
    const currentSheet = state.sheets[sheetId];
    currentSheet.isVisited = true;
  },
  [PRINT._MUTATES.UPDATE_SHEET_THUMBNAIL](state, { thumbnailUrl, sheetId }) {
    state.sheets[sheetId].thumbnailUrl = thumbnailUrl;
  }
};
