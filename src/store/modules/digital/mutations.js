import { cloneDeep, merge, uniqueId } from 'lodash';

import { moveItem } from '@/common/utils';

import { OBJECT_TYPE } from '@/common/constants';

import DIGITAL from './const';
import { isEmpty } from '@/common/utils';
import { addObject, deleteObjects } from '@/common/store';

export const mutations = {
  [DIGITAL._MUTATES.SET_BOOK_ID](state, { bookId }) {
    state.book.id = bookId;
  },
  [DIGITAL._MUTATES.SET_DEFAULT_THEME_ID](state, { themeId }) {
    state.book.defaultThemeId = themeId;
  },
  [DIGITAL._MUTATES.SET_SECTIONS_SHEETS](state, { sectionsSheets }) {
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
  [DIGITAL._MUTATES.ADD_OBJECT]: addObject,
  [DIGITAL._MUTATES.SET_PROP](state, { prop }) {
    if (!state.currentObjectId) return;

    const currentProps = cloneDeep(state.objects[state.currentObjectId]);

    merge(currentProps, prop);

    state.objects[state.currentObjectId] = currentProps;
  },
  [DIGITAL._MUTATES.SET_PROP_BY_ID](state, { id, prop }) {
    if (!id) return;

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

  [DIGITAL._MUTATES.DELETE_OBJECTS]: deleteObjects,
  [DIGITAL._MUTATES.UPDATE_TRIGGER_BACKGROUND_CHANGE](state) {
    state.triggerChange.background = !state.triggerChange.background;
  },
  [DIGITAL._MUTATES.UPDATE_TRIGGER_APPLY_LAYOUT](state) {
    state.triggerChange.applyLayout = !state.triggerChange.applyLayout;
  },
  [DIGITAL._MUTATES.UPDATE_SHEET_VISITED](state, { sheetId }) {
    const currentSheet = state.sheets[sheetId];
    currentSheet.isVisited = true;
  },
  [DIGITAL._MUTATES.UPDATE_FRAME_THUMBNAIL](state, { thumbnailUrl, frameId }) {
    state.frames[frameId].previewImageUrl = thumbnailUrl;
    if (frameId !== state.frameIds[0]) return;
    state.sheets[state.currentSheetId].thumbnailUrl = thumbnailUrl;
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
  [DIGITAL._MUTATES.SET_SUPPLEMENTAL_LAYOUT_ID](
    { frames, currentFrameId },
    { id }
  ) {
    if (isEmpty(frames)) return;

    frames[currentFrameId].supplementalLayoutId = id;
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
      const blankFrame = {
        id: uniqueId(),
        frame: {
          previewImageUrl: '',
          id: 0,
          fromLayout: true,
          frameTitle: '',
          objects: [],
          isVisited: true
        }
      };
      state.frames = { [blankFrame.id]: blankFrame.frame };
      state.frameIds = [blankFrame.id];
      state.currentFrameId = 0;
      return;
    }
    // keep supplement frames
    const supplementFrameIds = [];
    const supplementFrames = {};
    state.frameIds.forEach(id => {
      if (!state.frames[id].fromLayout) {
        supplementFrameIds.push(id);
        supplementFrames[id] = state.frames[id];
      }
    });

    const newFrameIds = framesList.map(f => f.id);

    const newFrames = {};

    framesList.forEach(f => {
      newFrames[f.id] = f.frame;
    });

    state.frameIds = [...newFrameIds, ...supplementFrameIds];
    state.frames = { ...newFrames, ...supplementFrames };
  },
  [DIGITAL._MUTATES.ADD_SUPPLEMENTAL_FRAMES](state, { frames }) {
    if (!frames?.length) return;

    frames.forEach(frame => {
      const id = uniqueId();
      state.frameIds.push(id);
      state.frames[id] = frame;
    });
  },
  [DIGITAL._MUTATES.REPLACE_SUPPLEMENTAL_FRAME](state, { frame, frameId }) {
    if (isEmpty(frame) || !frameId) return;

    state.frameIds = [...state.frameIds];

    state.frames[frameId] = frame;
  },
  [DIGITAL._MUTATES.REORDER_FRAME_IDS](state, { oldIndex, newIndex }) {
    const [id] = state.frameIds.splice(oldIndex, 1);
    state.frameIds.splice(newIndex, 0, id);
  },
  [DIGITAL._MUTATES.DELETE_FRAME](state, { id }) {
    if (!id) return;

    const index = state.frameIds.indexOf(id);
    if (index >= 0) {
      state.frameIds.splice(index, 1);
    }

    delete state.frames[id];
  },
  [DIGITAL._MUTATES.SET_CURRENT_FRAME_ID](state, { id }) {
    state.currentFrameId = id;
  },
  [DIGITAL._MUTATES.SET_FRAME_VISITED]({ frames, currentFrameId }, { value }) {
    frames[currentFrameId].isVisited = value;
  },
  [DIGITAL._MUTATES.MOVE_FRAME](state, { moveToIndex, selectedIndex }) {
    state.frameIds = moveItem(
      state.frameIds[selectedIndex],
      selectedIndex,
      moveToIndex,
      state.frameIds
    );
  },
  [DIGITAL._MUTATES.SET_TITLE_FRAME]({ frames, currentFrameId }, { value }) {
    frames[currentFrameId].frameTitle = value;
  },
  [DIGITAL._MUTATES.UPDATE_OBJECTS_TO_FRAME](
    { frames, background, objects, objectIds },
    { frameId }
  ) {
    if (!frameId || !frames[frameId]) return;

    const backgrounds = Object.values(background).filter(bg => !isEmpty(bg));
    const objectsData = [
      ...backgrounds,
      ...objectIds.map(id => ({ ...objects[id], id }))
    ];

    frames[frameId].objects = objectsData;
  }
};
