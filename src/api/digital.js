import { APPLY_MODE, OBJECT_TYPE } from '@/common/constants';
import {
  getSuccessWithData,
  getErrorWithMessages,
  Transition
} from '@/common/models';
import { parseItem } from '@/common/storage/session.helper';

import { isEmpty, getPageName } from '@/common/utils';
import { cloneDeep } from 'lodash';

import bookService from './book';

const digitalService = {
  /**
   * Get default theme id book
   *
   * @param   {Number}  bookId  id of current book
   * @returns {Object}          query result
   */
  getDefaultThemeId: async bookId => {
    const { book } = await bookService.getBookDigital(bookId);
    const data = book.themeId;

    return isEmpty(data) ? getErrorWithMessages([]) : getSuccessWithData(data);
  },
  /**
   * Get list of section & sheets inside each section
   * use in main page
   *
   * @param   {Number}  bookId  id of current book
   * @returns {Object}          query result
   */
  getDigitalSectionsSheets: async bookId => {
    let totalSheets = 0;

    const {
      sectionsAsArray,
      sheets: sheetData
    } = await bookService.getBookDigital(bookId);

    const data = sectionsAsArray.map(section => {
      const sheets = section.sheetIds.map((sheetId, sheetIndex) => {
        const sheet = sheetData[sheetId];
        const { id, type, thumbnailUrl, link } = sheet;

        const pageName = getPageName(sheetIndex, totalSheets);

        return {
          id,
          type,
          thumbnailUrl,
          link,
          pageName
        };
      });

      totalSheets += section.sheetIds.length;

      const { name, color, assigneeId } = section;

      return { name, color, assigneeId, sheets };
    });

    return isEmpty(data) ? getErrorWithMessages([]) : getSuccessWithData(data);
  },
  /**
   * Get list of section & sheets inside each section
   * use in page edit
   *
   * @param   {Number}  bookId  id of current book
   * @returns {Object}          query result
   */
  getDigitalEditSectionsSheets: async bookId => {
    let totalSheets = 0;

    const coverType = parseItem('bookCoverType');
    const maxPage = parseItem('bookMaxPage');

    const {
      book,
      sectionsAsArray,
      sheets: sheetData
    } = await bookService.getBookDigital(bookId);

    if (!isEmpty(coverType)) book.coverOption = coverType;

    if (!isEmpty(maxPage)) book.numberMaxPages = parseInt(maxPage, 10);

    const data = sectionsAsArray.map(section => {
      const sheets = section.sheetIds.map((sheetId, sheetIndex) => {
        const {
          id,
          type,
          isVisited,
          thumbnailUrl,
          themeId,
          layoutId
        } = sheetData[sheetId];

        const pageName = getPageName(sheetIndex, totalSheets);

        return {
          id,
          type,
          thumbnailUrl,
          isVisited,
          themeId,
          layoutId,
          pageName
        };
      });

      totalSheets += section.sheetIds.length;

      const { name, color, assigneeId } = section;

      return { id: section.id, name, color, assigneeId, sheets };
    });

    return isEmpty(data) ? getErrorWithMessages([]) : getSuccessWithData(data);
  },
  /**
   * Get frames of a specific sheet
   * @param {Number} bookId Id of book
   * @param {Number} sectionId Id of section
   * @param {Number} sheetId Id of sheet
   * @returns {Promise<array>} a list of frames [{id, frame:{}},...]
   */
  getFrames: async (bookId, sectionId, sheetId) => {
    const { sheets } = await bookService.getBookDigital(bookId);

    const frames = sheets[sheetId].frames;

    /**
     * Temp code for re-checking transition - START
     * It should be done in backend
     */
    const findSectionSheetIndex = () => {
      const sectionIndex = window.data.book.sections.findIndex(section => {
        return section.sheets.findIndex(({ id }) => id === sheetId) >= 0;
      });

      if (sectionIndex < 0) return { sectionIndex: -1, sheetIndex: -1 };

      const sheetIndex = window.data.book.sections[
        sectionIndex
      ].sheets.findIndex(({ id }) => id === sheetId);

      return sheetIndex < 0
        ? { sectionIndex: -1, sheetIndex: -1 }
        : { sectionIndex, sheetIndex };
    };

    const reCalculateTransition = () => {
      const { sectionIndex, sheetIndex } = findSectionSheetIndex(sheetId);

      if (sheetIndex < 0) return;

      const transitions =
        window.data.book.sections[sectionIndex].sheets[sheetIndex].digitalData
          .transitions;

      const correctTotal = frames.length - 1;

      if (transitions.length === correctTotal) return;

      if (transitions.length > correctTotal) {
        const totalMore = transitions.length - correctTotal;

        transitions.splice(transitions.length - totalMore, totalMore);
      }

      if (transitions.length < correctTotal) {
        const totalLess = correctTotal - transitions.length;

        for (let i = 0; i < totalLess; i++) {
          transitions.splice(transitions.length, 1, new Transition());
        }
      }

      window.data.book.sections[sectionIndex].sheets[
        sheetIndex
      ].digitalData.transitions = transitions;
    };

    reCalculateTransition();
    /** Temp code for re-checking transition - END */

    const data = frames || [];

    return !data ? getErrorWithMessages([]) : getSuccessWithData(data);
  },
  // temporary code, will remove soon
  getGeneralInfo: async bookId => {
    const { book } = await bookService.getBookDigital(bookId);

    const { title, totalSheets, totalPages, totalScreens } = book;

    return {
      title,
      totalSheet: totalSheets,
      totalPage: totalPages,
      totalScreen: totalScreens
    };
  },
  updateSheet(sheetId, props) {
    return new Promise(resolve => {
      if (!sheetId) return;

      const sheets = getSheetsFromStorage();

      const sheet = sheets[sheetId];
      sheet.digitalData._set(props);

      resolve(sheet);
    });
  },

  /**
   * save theme id in global book variable
   * @param {Number} themeId id of theme that will be saved
   */
  saveDefaultThemeId: themeId => {
    return new Promise(resolve => {
      window.data.book.digitalData.themeId = themeId;

      resolve();
    });
  },

  /**
   * save data of Digital EditScreen to database
   */
  saveEditScreen: async (sheetId, payload) => {
    const { defaultThemeId, sheet, frames } = cloneDeep(payload);

    sheet.frames = frames;

    const saveQueue = [];

    // save default themeId
    saveQueue.push(digitalService.saveDefaultThemeId(defaultThemeId));

    saveQueue.push(digitalService.updateSheet(sheetId, sheet));
    const response = await Promise.all(saveQueue);

    // TODO: remove when integrate API
    // Simulate a delay when saving data to API
    await new Promise(r => setTimeout(() => r(), 300));

    return {
      data: response,
      status: 'OK'
    };
  },
  saveMainScreen: async data => {
    const sheets = getSheetsFromStorage();

    Object.values(sheets).forEach(s => s._set(data[s.id]));

    return;
  },
  /**
   * to save sheet media
   */
  saveSheetMedia: (sheetId, media) => {
    return digitalService.updateSheet(sheetId, { media });
  },

  /**
   * get media of sheet
   */
  getSheetMedia: sheetId => {
    const sheets = cloneDeep(getSheetsFromStorage());
    const { media } = sheets[sheetId].digitalData;
    return media;
  },
  /**
   * Delete media from sheet by id
   * @param {String} sheetId sheet's id to delete media
   * @param {String} mediaId media's id will be deleted
   */
  deleteSheetMediaById: async (sheetId, mediaId) => {
    try {
      if (!sheetId || !mediaId) throw false;
      const sheets = cloneDeep(getSheetsFromStorage());
      const { media } = sheets[sheetId].digitalData;
      const newMedia = media.filter(item => item.id !== mediaId);
      await digitalService.updateSheet(sheetId, { media: newMedia });
      return Promise.resolve({
        success: true
      });
    } catch (err) {
      return Promise.reject({
        success: false,
        error: err
      });
    }
  },

  /**
   * Save animation play in/out config
   * @param {Object} animationConfig config will be saved to objects
   */
  saveAnimationConfig: async animationConfig => {
    const { animationIn, animationOut } = animationConfig;

    const promises = [];

    if (!isEmpty(animationIn)) {
      const {
        TextObject,
        ImageObject,
        ShapeObject,
        ClipArtObject,
        BackgroundObject
      } = animationIn;

      if (!isEmpty(TextObject)) {
        promises.push(savePlayInConfig(OBJECT_TYPE.TEXT, TextObject));
      }

      if (!isEmpty(ImageObject)) {
        promises.push(savePlayInConfig(OBJECT_TYPE.IMAGE, ImageObject));
      }

      if (!isEmpty(ShapeObject)) {
        promises.push(savePlayInConfig(OBJECT_TYPE.SHAPE, ShapeObject));
      }

      if (!isEmpty(ClipArtObject)) {
        promises.push(savePlayInConfig(OBJECT_TYPE.CLIP_ART, ClipArtObject));
      }

      if (!isEmpty(BackgroundObject)) {
        promises.push(
          savePlayInConfig(OBJECT_TYPE.BACKGROUND, BackgroundObject)
        );
      }
    }

    if (!isEmpty(animationOut)) {
      const {
        TextObject,
        ImageObject,
        ShapeObject,
        ClipArtObject,
        BackgroundObject
      } = animationOut;

      if (!isEmpty(TextObject)) {
        promises.push(savePlayOutConfig(OBJECT_TYPE.TEXT, TextObject));
      }

      if (!isEmpty(ImageObject)) {
        promises.push(savePlayOutConfig(OBJECT_TYPE.IMAGE, ImageObject));
      }

      if (!isEmpty(ShapeObject)) {
        promises.push(savePlayOutConfig(OBJECT_TYPE.SHAPE, ShapeObject));
      }

      if (!isEmpty(ClipArtObject)) {
        promises.push(savePlayOutConfig(OBJECT_TYPE.CLIP_ART, ClipArtObject));
      }

      if (!isEmpty(BackgroundObject)) {
        promises.push(
          savePlayOutConfig(OBJECT_TYPE.BACKGROUND, BackgroundObject)
        );
      }
    }

    return await Promise.all(promises);
  }
};

export default digitalService;

// TODO: Remove when integrate API
// Temporary helper function
function getSheetsFromStorage() {
  const sheets = {};
  window.data.book.sections.forEach(section => {
    section.sheets.forEach(sheet => (sheets[sheet.id] = sheet));
  });

  return sheets;
}

// TODO: Remove when integrate API
// Temporary helper function
function getSectionObjects(sectionId) {
  const section = window.data.book.sections.find(s => s.id === sectionId);

  if (isEmpty(section)) return [];

  const objects = [];

  section.sheets.forEach(sheet => {
    sheet.digitalData.frames.forEach(frame => {
      objects.push(...frame.frame.objects);
    });
  });

  return objects;
}

// TODO: Remove when integrate API
// Temporary helper function
function getBookObjects() {
  const objects = [];

  window.data.book.sections.forEach(section => {
    section.sheets.forEach(sheet => {
      sheet.digitalData.frames.forEach(frame => {
        objects.push(...frame.frame.objects);
      });
    });
  });

  return objects;
}

// TODO: Remove when integrate API
// Temporary helper function
async function savePlayInConfig(objectType, config) {
  const { storeType, storeTypeId, setting } = config;

  if (!storeType || !storeTypeId) return Promise.reject();

  const objects =
    storeType === APPLY_MODE.SECTION
      ? getSectionObjects(storeTypeId)
      : getBookObjects(storeTypeId);

  objects.forEach(object => {
    if (object.type === objectType) {
      object.animationIn = { ...setting };
    }
  });

  return Promise.resolve({ success: true });
}

// TODO: Remove when integrate API
// Temporary helper function
async function savePlayOutConfig(objectType, config) {
  const { storeType, storeTypeId, setting } = config;

  if (!storeType || !storeTypeId) return Promise.reject();

  const objects =
    storeType === APPLY_MODE.SECTION
      ? getSectionObjects(storeTypeId)
      : getBookObjects();

  objects.forEach(object => {
    if (object.type === objectType) {
      object.animationOut = { ...setting };
    }
  });

  return Promise.resolve({ success: true });
}
