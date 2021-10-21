import { cloneDeep, merge } from 'lodash';

import {
  getUniqueId,
  moveItem,
  sortAnimationOrder,
  isEmpty
} from '@/common/utils';

import { OBJECT_TYPE } from '@/common/constants';

import DIGITAL from './const';
import {
  addObject,
  addObjects,
  deleteObjects,
  setBackgrounds,
  setBookInfo
} from '@/common/store';

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

    if (isEmpty(state.playInIds)) {
      state.playInIds = [[]];
    }

    if (isEmpty(state.playOutIds)) {
      state.playOutIds = [[]];
    }

    objectList.forEach(o => {
      if (o.type === OBJECT_TYPE.BACKGROUND) return;

      objects[o.id] = o;

      const playInIds = [].concat(...state.playInIds);
      const playOutIds = [].concat(...state.playOutIds);

      if (!playInIds.includes(o.id)) {
        state.playInIds[0].push(o.id);
      }

      if (!playOutIds.includes(o.id)) {
        state.playOutIds[0].push(o.id);
      }
    });

    state.objects = objects;
  },
  [DIGITAL._MUTATES.SET_PLAY_IN_IDS](state, { playInIds }) {
    state.playInIds = playInIds || [];
  },
  [DIGITAL._MUTATES.SET_PLAY_OUT_IDS](state, { playOutIds }) {
    state.playOutIds = playOutIds || [];
  },
  [DIGITAL._MUTATES.SET_CURRENT_SHEET_ID](state, { id }) {
    state.currentSheetId = id;
  },
  [DIGITAL._MUTATES.SET_BACKGROUND](state, { background = {} }) {
    state.background.left = background;
  },
  [DIGITAL._MUTATES.SET_CURRENT_OBJECT_ID](state, { id }) {
    state.currentObjectId = id;
  },
  [DIGITAL._MUTATES.ADD_OBJECT]: addObject,
  [DIGITAL._MUTATES.ADD_OBJECTS]: addObjects,
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
  },
  [DIGITAL._MUTATES.UPDATE_SHEET_THUMBNAIL](state, { thumbnailUrl, sheetId }) {
    if (isEmpty(thumbnailUrl) || isEmpty(sheetId)) return;
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

    framesList.forEach(frame => {
      if (isEmpty(frame.playInIds)) {
        frame.playInIds = [
          frame.objects
            .filter(
              o => o.type !== OBJECT_TYPE.BACKGROUND && o?.animationIn?.style
            )
            .map(f => f.id)
        ];
      }
      newFrames[frame.id] = frame;
    });

    state.frameIds = [...newFrameIds, ...supplementFrameIds];
    state.frames = { ...newFrames, ...supplementFrames };
  },
  [DIGITAL._MUTATES.ADD_SUPPLEMENTAL_FRAMES](state, { frames }) {
    if (!frames?.length) return;

    frames.forEach(frame => {
      let id = getUniqueId();
      while (state.frameIds.includes(id)) id = getUniqueId();

      state.frameIds = [...state.frameIds, id];
      state.frames = { ...state.frames, [id]: { ...frame, id } };
    });
  },
  [DIGITAL._MUTATES.REPLACE_SUPPLEMENTAL_FRAME](state, { frame, frameId }) {
    if (isEmpty(frame) || !frameId) return;

    state.frameIds = [...state.frameIds];

    state.frames[frameId] = { ...frame, id: frameId };
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
    frames[currentFrameId].title = value;
  },
  [DIGITAL._MUTATES.SET_FRAME_DELAY]({ frames, currentFrameId }, { value }) {
    frames[currentFrameId].delay = value;
  },
  [DIGITAL._MUTATES.UPDATE_OBJECTS_TO_FRAME](
    { frames, background, objects, objectIds, playInIds, playOutIds },
    { frameId }
  ) {
    if (!frameId || !frames[frameId]) return;

    const backgrounds = Object.values(background).filter(bg => !isEmpty(bg));
    const objectsData = [
      ...backgrounds,
      ...objectIds.map(id => ({ ...objects[id], id }))
    ];

    frames[frameId].objects = objectsData;
    frames[frameId].playInIds = playInIds;
    frames[frameId].playOutIds = playOutIds;
  },
  [DIGITAL._MUTATES.SET_BACKGROUNDS]: setBackgrounds,
  [DIGITAL._MUTATES.SET_BOOK_INFO]: setBookInfo,
  [DIGITAL._MUTATES.SET_SHEET_MEDIA](state, { media }) {
    state.sheets[state.currentSheetId].media = media;
  },
  [DIGITAL._MUTATES.UPDATE_TRIGGER_TRANSITION](state) {
    state.triggerChange.transition = !state.triggerChange.transition;
  },
  [DIGITAL._MUTATES.UPDATE_TRIGGER_ANIMATION](state) {
    state.triggerChange.animation = !state.triggerChange.animation;
  },
  [DIGITAL._MUTATES.SET_STORE_ANIMATION_PROP](state, { storeAnimationProp }) {
    if (isEmpty(storeAnimationProp)) {
      state.storeAnimationProp = {};

      return state.storeAnimationProp;
    }

    const currentProp = cloneDeep(state.storeAnimationProp);

    state.storeAnimationProp = merge(currentProp, storeAnimationProp);
  },
  [DIGITAL._MUTATES.SET_PLAY_IN_ORDER](state, order) {
    const id = state.currentObjectId;
    const newIndex = order - 1;

    if (!id || newIndex < 0) return;

    const playInIds = cloneDeep(state.playInIds);

    const ids = playInIds.find(item => item.includes(id));

    if (!isEmpty(ids)) {
      const index = ids.findIndex(i => +i === +id);
      ids.splice(index, 1);
    }

    if (!playInIds[newIndex]) {
      playInIds[newIndex] = [];
    }

    playInIds[newIndex].push(id);

    const tmpArr = [...playInIds].map(item => item || []);
    const reverseArr = [...tmpArr].reverse();

    reverseArr.forEach(item => {
      if (isEmpty(item)) tmpArr.pop();
      else reverseArr.length = 0;
    });

    state.playInIds = sortAnimationOrder(tmpArr, state.objects);
  },
  [DIGITAL._MUTATES.SET_PLAY_OUT_ORDER](state, order) {
    const id = state.currentObjectId;
    const newIndex = order - 1;

    if (!id || newIndex < 0) return;

    const playOutIds = cloneDeep(state.playOutIds);
    const ids = playOutIds.find(item => item.includes(id));

    if (!isEmpty(ids)) {
      const index = ids.findIndex(i => +i === +id);
      ids.splice(index, 1);
    }

    if (!playOutIds[newIndex]) {
      playOutIds[newIndex] = [];
    }

    playOutIds[newIndex].push(id);

    const tmpArr = [...playOutIds].map(item => item || []);
    const reverseArr = [...tmpArr].reverse();

    reverseArr.forEach(item => {
      if (isEmpty(item)) tmpArr.pop();
      else reverseArr.length = 0;
    });

    state.playOutIds = sortAnimationOrder(tmpArr, state.objects);
  }
};
