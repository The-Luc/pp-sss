import { cloneDeep } from 'lodash';
import { isEmpty } from '@/common/utils';

import {
  calcFrameAnimationDuration,
  isPhotoVisited,
  sectionsWithSheets,
  defaultThemeId,
  communityId,
  getDigitalBackground,
  bookUserId
} from '@/common/store';

import DIGITAL from './const';

import { OBJECT_TYPE } from '@/common/constants';

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
  [DIGITAL._GETTERS.BACKGROUNDS_NO_LAYOUT]: getDigitalBackground,
  [DIGITAL._GETTERS.BACKGROUNDS]: getDigitalBackground,
  [DIGITAL._GETTERS.BACKGROUNDS_PROPERTIES]: ({ background }) => {
    return isEmpty(background.left)
      ? { isSingle: true, isEmpty: true }
      : { isSingle: true, background: background.left };
  },
  [DIGITAL._GETTERS.SECTIONS_SHEETS]: sectionsWithSheets,
  [DIGITAL._GETTERS.DEFAULT_THEME_ID]: defaultThemeId,
  [DIGITAL._GETTERS.GET_ARRAY_FRAMES]: ({ frames, frameIds }) => {
    return frameIds.map(id => frames[id]);
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

    return sections.find(s => s.sheetIds.includes(String(currentSheetId)));
  },
  [DIGITAL._GETTERS.GET_FIRST_FRAME_THUMBNAIL]: state => {
    if (isEmpty(state.frameIds)) return;
    return state.frames[state.frameIds[0]].previewImageUrl;
  },
  [DIGITAL._GETTERS.GET_DATA_EDIT_SCREEN]: ({
    book,
    frames,
    currentSheetId
  }) => frameId =>
    cloneDeep({
      defaultThemeId: book.defaultThemeId,
      bookId: book.id,
      frame: frames[frameId],
      sheetId: currentSheetId
    }),
  [DIGITAL._GETTERS.GET_SHEET_MEDIA]: ({ sheets, currentSheetId }) => {
    const media = sheets[currentSheetId]?.media;
    return isEmpty(media) ? [] : media;
  },
  [DIGITAL._GETTERS.TRIGGER_TRANSITION]: ({ triggerChange }) =>
    triggerChange.transition,
  [DIGITAL._GETTERS.TRIGGER_ANIMATION]: ({ triggerChange }) =>
    triggerChange.animation,
  [DIGITAL._GETTERS.PLAY_IN_IDS]: ({ playInIds }) => {
    return playInIds;
  },
  [DIGITAL._GETTERS.PLAY_OUT_IDS]: ({ playOutIds }) => {
    return playOutIds;
  },
  [DIGITAL._GETTERS.PLAY_IN_ORDER]: ({ playInIds, currentObjectId }) => {
    if (!currentObjectId) return;

    const index = playInIds.findIndex(ids => ids.includes(currentObjectId));

    return index < 0 ? 1 : index + 1;
  },
  [DIGITAL._GETTERS.PLAY_OUT_ORDER]: ({ playOutIds, currentObjectId }) => {
    if (!currentObjectId) return;

    const index = playOutIds.findIndex(ids => ids.includes(currentObjectId));

    return index < 0 ? 1 : index + 1;
  },
  [DIGITAL._GETTERS.TOTAL_ANIMATION_PLAY_OUT_ORDER]: ({
    playOutIds,
    objects
  }) => {
    const hasOrder = Object.values(objects).some(
      obj => obj.type !== OBJECT_TYPE.BACKGROUND && obj.animationOut.style
    );

    return hasOrder ? playOutIds.length : 0;
  },
  [DIGITAL._GETTERS.GET_FRAME_IDS]: ({ frameIds }) => {
    return frameIds;
  },
  [DIGITAL._GETTERS.GET_BOOK_INFO]: ({ book }) => book,
  [DIGITAL._GETTERS.CURRENT_FRAME_INDEX]: ({ frameIds, currentFrameId }) => {
    return frameIds.indexOf(currentFrameId);
  },
  [DIGITAL._GETTERS.GET_PLAY_IN_DURATION]: ({ playInIds, objects }) =>
    calcFrameAnimationDuration(objects, playInIds, 'animationIn'),
  [DIGITAL._GETTERS.GET_PLAY_OUT_DURATION]: ({ playOutIds, objects }) =>
    calcFrameAnimationDuration(objects, playOutIds, 'animationOut'),
  [DIGITAL._GETTERS.GET_TOTAL_VIDEO_DURATION]: ({ objects }) => {
    return Object.values(objects).reduce(
      (acc, o) =>
        o?.type === OBJECT_TYPE.VIDEO ? acc + o.endTime - o.startTime : acc,
      0
    );
  },
  [DIGITAL._GETTERS.IS_PHOTO_VISITED]: isPhotoVisited,
  [DIGITAL._GETTERS.COMMUNITY_ID]: communityId,
  [DIGITAL._GETTERS.BOOK_USER_ID]: bookUserId,
  [DIGITAL._GETTERS.GET_MEDIA_OBJECT_IDS]: ({ objects }) => {
    return Object.values(objects)
      .filter(o => o?.imageId)
      .map(o => o.imageId);
  }
};
