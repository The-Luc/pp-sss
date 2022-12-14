import {
  isPhotoVisited,
  sectionsWithSheets,
  defaultThemeId,
  communityId,
  bookUserId
} from '@/common/store';

import {
  isEmpty,
  isHalfSheet,
  isHalfLeft,
  isFullBackground
} from '@/common/utils';

import PRINT from './const';

export const getters = {
  [PRINT._GETTERS.CURRENT_SHEET]: ({ sheets, currentSheetId }) => {
    const currentSheet = sheets[currentSheetId];

    return isEmpty(currentSheet) ? {} : currentSheet;
  },
  [PRINT._GETTERS.SHEET_BY_ID]: ({ sheets }) => sheetId => sheets[sheetId],
  [PRINT._GETTERS.TOTAL_BACKGROUND]: ({ background }) => {
    const backgrounds = [background.left, background.right].filter(bg => {
      return !isEmpty(bg);
    });

    return backgrounds.length;
  },
  [PRINT._GETTERS.CURRENT_OBJECT]: ({ objects, currentObjectId }) => {
    const currentObject = objects[currentObjectId];

    return isEmpty(currentObject) ? {} : currentObject;
  },
  [PRINT._GETTERS.CURRENT_OBJECT_ID]: ({ currentObjectId }) => {
    return currentObjectId;
  },
  [PRINT._GETTERS.OBJECT_BY_ID]: ({ objects }) => id => objects[id],
  [PRINT._GETTERS.SELECT_PROP_CURRENT_OBJECT]: ({
    objects,
    currentObjectId
  }) => prop => {
    const propValue = objects[currentObjectId]?.[prop];

    return isEmpty(propValue) ? null : propValue;
  },
  [PRINT._GETTERS.SELECT_PROP_OBJECT_BY_ID]: ({ objects }) => ({
    id,
    prop
  }) => {
    const propValue = objects[id]?.[prop];

    return isEmpty(propValue) ? null : propValue;
  },
  [PRINT._GETTERS.TRIGGER_TEXT_CHANGE]: ({ triggerChange }) =>
    triggerChange.text,
  [PRINT._GETTERS.TRIGGER_BACKGROUND_CHANGE]: ({ triggerChange }) =>
    triggerChange.background,
  [PRINT._GETTERS.GET_OBJECTS]: ({ objects }) => {
    return objects;
  },
  [PRINT._GETTERS.SHEET_LAYOUT]: ({ objects, background, objectIds }) => {
    return [
      ...Object.values(background).filter(bg => !isEmpty(bg)),
      ...objectIds.map(id => objects[id])
    ];
  },
  [PRINT._GETTERS.GET_SHEETS]: ({ sheets }) => {
    return sheets;
  },
  [PRINT._GETTERS.BACKGROUNDS_NO_LAYOUT]: ({ background }) => {
    return [background.left, background.right].filter(bg => {
      return !isEmpty(bg.backgroundType);
    });
  },
  [PRINT._GETTERS.BACKGROUNDS_PROPERTIES]: ({
    currentSheetId,
    sheets,
    background
  }) => {
    const existedBackground = [background.left, background.right].filter(
      bg => !isEmpty(bg)
    );

    if (isEmpty(existedBackground)) {
      return { isSingle: true, isEmpty: true };
    }

    if (isFullBackground(background.left)) {
      return {
        isSingle: true,
        background: background.left
      };
    }

    const isHalf = isHalfSheet(sheets[currentSheetId]);
    const position = isHalfLeft(sheets[currentSheetId]) ? 'left' : 'right';

    if (isHalf) {
      return {
        isSingle: true,
        background: background[position]
      };
    }

    return {
      isSingle: false,
      left: background.left,
      right: background.right
    };
  },

  [PRINT._GETTERS.SECTIONS_SHEETS]: sectionsWithSheets,
  [PRINT._GETTERS.GET_PAGE_INFO]: ({ book }) => book.pageInfo,
  [PRINT._GETTERS.DEFAULT_THEME_ID]: defaultThemeId,
  [PRINT._GETTERS.TOTAL_OBJECT]: ({ objectIds }) => {
    return objectIds.length;
  },
  [PRINT._GETTERS.GET_OBJECTS_AND_BACKGROUNDS]: ({
    objects,
    background,
    objectIds
  }) => {
    const backgrounds = Object.values(background).filter(bg => !isEmpty(bg));
    return [
      ...backgrounds.map(bg => ({ id: bg.id, object: bg })),
      ...objectIds.map(id => ({ id, object: { ...objects[id], id } }))
    ];
  },
  [PRINT._GETTERS.BACKGROUNDS]: ({ background }) => {
    return background;
  },
  [PRINT._GETTERS.CURRENT_SECTION]: ({ sections, currentSheetId }) => {
    if (isEmpty(currentSheetId)) return '';
    return sections.find(s => s.sheetIds.includes(String(currentSheetId)));
  },
  [PRINT._GETTERS.GET_DATA_EDIT_SCREEN]: ({
    background,
    objectIds,
    book,
    sheets,
    objects
  }) => sheetId => {
    const backgrounds = Object.values(background).filter(bg => !isEmpty(bg));
    const objectsData = [
      ...backgrounds,
      ...objectIds.map(id => ({ ...objects[id], id }))
    ];

    return {
      objects: objectsData,
      pageInfo: book.pageInfo,
      defaultThemeId: book.defaultThemeId,
      sheetProps: sheets[sheetId],
      bookId: book.id,
      communityId: book.communityId
    };
  },
  [PRINT._GETTERS.GET_SHEET_MEDIA]: ({ sheets, currentSheetId }) => {
    const media = sheets[currentSheetId]?.media;
    return isEmpty(media) ? [] : media;
  },
  [PRINT._GETTERS.IS_PHOTO_VISITED]: isPhotoVisited,
  [PRINT._GETTERS.COMMUNITY_ID]: communityId,
  [PRINT._GETTERS.BOOK_USER_ID]: bookUserId,
  [PRINT._GETTERS.GET_BOOK_INFO]: ({ book }) => book,
  [PRINT._GETTERS.GET_MEDIA_OBJECT_IDS]: ({ objects }) => {
    return Object.values(objects)
      .filter(o => o.imageId)
      .map(o => o.imageId);
  }
};
