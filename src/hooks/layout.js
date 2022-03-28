import { useMutations, useGetters, useActions } from 'vuex-composition-helpers';

import {
  saveToFavoritesApi,
  deleteFavoritesApi,
  getFavoritesApi,
  getFavoriteLayoutsApi
} from '@/api/user';
import {
  getLayoutElementsApi,
  saveCustomPrintLayoutApi,
  getCustomPrintLayoutApi,
  getCustomDigitalLayoutApi,
  saveCustomDigitalLayoutApi
} from '@/api/layout';

import { GETTERS as THEME_GETTERS } from '@/store/modules/theme/const';

import {
  MUTATES as APP_MUTATES,
  GETTERS as APP_GETTERS
} from '@/store/modules/app/const';
import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES,
  ACTIONS as PRINT_ACTIONS
} from '@/store/modules/print/const';
import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';

import {
  TOOL_NAME,
  EDITION,
  MODAL_TYPES,
  COVER_TYPE,
  TRANS_TARGET,
  SHEET_TYPE,
  LAYOUT_PAGE_TYPE,
  OBJECT_TYPE
} from '@/common/constants';

import {
  generateCanvasThumbnail,
  getPageLayouts,
  isCoverSheet,
  isHalfSheet,
  isHalfRight,
  isOk,
  isEmpty,
  entitiesToObjects
} from '@/common/utils';
import { useThumbnail } from '@/views/CreateBook/composables';
import { cloneDeep } from 'lodash';
import { getFrameObjectsApi, deleteFrameApi } from '@/api/frame';
import { useFrame, useFrameOrdering, useFrameAction } from '@/hooks';
import { updateTransitionApi } from '@/api/playback';
import { removeMediaContentWhenCreateThumbnail } from '../common/utils/image';
import { changeObjectsCoords } from '@/common/utils/layout';
import { getSheetTransitionApi } from '@/api/playback/api_query';
import { getUniqueId } from '../common/utils/util';

export const useLayoutPrompt = edition => {
  const EDITION_GETTERS =
    edition === EDITION.PRINT ? PRINT_GETTERS : DIGITAL_GETTERS;
  const EDITION_MUTATES =
    edition === EDITION.PRINT ? PRINT_MUTATES : DIGITAL_MUTATES;

  const { isPrompt, pageSelected, themeId } = useGetters({
    isPrompt: APP_GETTERS.IS_PROMPT,
    pageSelected: EDITION_GETTERS.CURRENT_SHEET,
    themeId: EDITION_GETTERS.DEFAULT_THEME_ID
  });

  const { setIsPrompt, setToolNameSelected, updateVisited } = useMutations({
    updateVisited: EDITION_MUTATES.UPDATE_SHEET_VISITED,
    setIsPrompt: APP_MUTATES.SET_IS_PROMPT,
    setToolNameSelected: APP_MUTATES.SET_TOOL_NAME_SELECTED
  });

  const openPrompt = promptEdtion => {
    setIsPrompt({ isPrompt: true });

    const toolName =
      promptEdtion === EDITION.PRINT
        ? TOOL_NAME.PRINT_LAYOUTS
        : TOOL_NAME.DIGITAL_LAYOUTS;

    setToolNameSelected({ name: toolName });
  };

  return {
    updateVisited,
    isPrompt,
    setIsPrompt,
    pageSelected,
    openPrompt,
    themeId
  };
};
/**
 * to return the getters of corresponding mode
 * @param {String} edition indicate which mode is currently active (print / digital)
 * @returns getters
 */
export const useGetLayouts = edition => {
  if (edition === EDITION.PRINT) {
    return getterPrintLayout();
  } else {
    return getterDigitalLayout();
  }
};

/**
 * to get layout elements
 * @returns layout elements
 */
export const useLayoutElements = () => ({
  getLayoutElements: getLayoutElementsApi
});

/**
 * to return the getters digital layout
 * @returns getters
 */
const getterDigitalLayout = () => {
  const { sheetLayout, listLayouts } = useGetters({
    sheetLayout: DIGITAL_GETTERS.SHEET_LAYOUT,
    listLayouts: THEME_GETTERS.GET_DIGITAL_LAYOUTS_BY_THEME_ID
  });

  return { sheetLayout, listLayouts };
};

/**
 * Return the getters print layout
 * @returns getters
 */
const getterPrintLayout = () => {
  const { sheetLayout, listLayouts } = useGetters({
    sheetLayout: PRINT_GETTERS.SHEET_LAYOUT,
    getLayoutsByType: THEME_GETTERS.GET_PRINT_LAYOUT_BY_TYPE,
    listLayouts: THEME_GETTERS.GET_PRINT_LAYOUTS_BY_THEME_ID
  });

  return { sheetLayout, listLayouts };
};

export const useActionLayout = () => {
  const saveToFavorites = async id => {
    const res = await saveToFavoritesApi(id);

    return isOk(res);
  };

  const deleteFavorites = async id => {
    const res = await deleteFavoritesApi(id);

    return isOk(res);
  };

  return {
    saveToFavorites,
    deleteFavorites,
    getFavorites: getFavoritesApi,
    getFavoriteLayouts: getFavoriteLayoutsApi
  };
};

export const useCustomLayout = () => {
  const { toggleModal } = useMutations({
    toggleModal: APP_MUTATES.TOGGLE_MODAL
  });

  const { getBookInfo: bookInfo } = useGetters({
    getBookInfo: PRINT_GETTERS.GET_BOOK_INFO
  });

  const { uploadBase64Image } = useThumbnail();

  /**
   *  Used to generate thumbnails when saving user custom templates
   */
  const getLayoutThumbnail = async (objects, options, isDigital) => {
    // remove image url of image object and convert video to image
    const modifyObjects = removeMediaContentWhenCreateThumbnail(objects);

    return generateCanvasThumbnail(modifyObjects, isDigital, options);
  };

  const saveCustomPrintLayout = async (setting, data) => {
    const { id, type, layoutName } = setting;

    const isSpread = type === 'SHEET';

    let objects = cloneDeep(data.objects);

    if (!(isSpread || isHalfSheet(data.sheetProps))) {
      const { leftLayout, rightLayout } = getPageLayouts(data);
      const pageIds = data.sheetProps.pageIds;

      objects = id === pageIds[0] ? leftLayout.elements : rightLayout.elements;
    }

    if (isHalfRight(data.sheetProps)) {
      objects = changeObjectsCoords(objects, 'right', { moveToLeft: true });
    }

    const isCover = isCoverSheet(data.sheetProps);
    const isHardCover =
      COVER_TYPE.HARDCOVER === bookInfo.value.coverOption && isCover;

    const options = {
      isSpread,
      isCover,
      isHardCover
    };

    const imageBase64 = await getLayoutThumbnail(objects, options);

    const previewImageUrl = await uploadBase64Image(imageBase64);

    const isSuccess = await saveCustomPrintLayoutApi(
      id,
      type,
      layoutName,
      previewImageUrl
    );

    if (!isSuccess) return;

    toggleModal({
      isOpenModal: true,
      modalData: {
        type: MODAL_TYPES.SAVE_LAYOUT_SUCCESS
      }
    });
  };

  const getCustomPrintLayout = async () => {
    const layouts = await getCustomPrintLayoutApi();
    return layouts.map(layout => ({
      ...layout,
      isCustom: true
    }));
  };
  /**
   * Return package and supplemental layouts that user saved
   */
  const getCustomDigitalLayout = async () => {
    const layouts = await getCustomDigitalLayoutApi();
    return layouts;
  };

  const saveCustomDigitalLayout = async setting => {
    const { ids, isSupplemental, layoutName } = setting;

    // get frame data
    const framesObjects = await Promise.all(
      ids.map(id => getFrameObjectsApi(id))
    );

    // generate thumbnails
    const imageBase64 = await Promise.all(
      framesObjects.map(objects => getLayoutThumbnail(objects, {}, true))
    );

    const previewImageUrls = await Promise.all(
      imageBase64.map(img => uploadBase64Image(img))
    );

    const frameSelections = ids.map((id, index) => ({
      id: +id,
      preview_image_url: previewImageUrls[index]
    }));

    // currently save only the thumbanail of the first frame
    // to make the layout thumbnail
    const isSuccess = await saveCustomDigitalLayoutApi({
      frameSelections,
      isSupplemental,
      title: layoutName,
      previewUrl: previewImageUrls[0]
    });

    // if successed, show the success modal
    if (!isSuccess) return;

    toggleModal({
      isOpenModal: true,
      modalData: {
        type: MODAL_TYPES.SAVE_LAYOUT_SUCCESS
      }
    });
  };

  return {
    saveCustomPrintLayout,
    getCustom: getCustomPrintLayout,
    getCustomDigitalLayout,
    saveCustomDigitalLayout
  };
};

export const useApplyPrintLayout = () => {
  const { currentSheet, getObjects } = useGetters({
    currentSheet: PRINT_GETTERS.CURRENT_SHEET,
    getObjects: PRINT_GETTERS.GET_OBJECTS
  });

  const {
    clearBackgrounds,
    setBackground,
    setObjects,
    setSheetData
  } = useMutations({
    clearBackgrounds: PRINT_MUTATES.CLEAR_BACKGROUNDS,
    setBackground: PRINT_MUTATES.SET_BACKGROUND,
    setObjects: PRINT_MUTATES.SET_OBJECTS,
    setSheetData: PRINT_MUTATES.SET_SHEET_DATA
  });

  const handleAddingBackgrounds = (
    objects,
    isFullLayout,
    currentPosition,
    isLeftPage
  ) => {
    // Get background object
    const backgroundObjs = objects.filter(
      obj => obj.type === OBJECT_TYPE.BACKGROUND
    );

    if (backgroundObjs.length === 0) {
      const selectedPosition = isFullLayout ? '' : currentPosition;

      clearBackgrounds(selectedPosition);
    }

    if (backgroundObjs.length === 2) {
      backgroundObjs.forEach(bg => {
        setBackground({ background: bg });
      });
    }

    if (backgroundObjs.length === 1) {
      isFullLayout && clearBackgrounds();

      backgroundObjs[0].isLeftPage = isFullLayout || isLeftPage;
      setBackground({ background: backgroundObjs[0] });
    }
  };

  const applyPrintLayout = async ({
    themeId,
    layout,
    pagePosition,
    positionCenterX
  }) => {
    const sheetType = currentSheet.value.type;

    const objects = entitiesToObjects(layout.objects);

    // Check whether user has add single page or not.
    //Value: left or right with single page else undefine
    const isFullLayout = layout.pageType === LAYOUT_PAGE_TYPE.FULL_PAGE.id;

    // Front cover always has the right page
    // Back cover always has the left page
    const currentPosition = (() => {
      if (sheetType === SHEET_TYPE.FRONT_COVER) return 'right';

      return currentSheet.type === SHEET_TYPE.BACK_COVER
        ? 'left'
        : pagePosition;
    })();

    const isLeftPage = currentPosition === 'left';
    const isRightPage = currentPosition === 'right';

    handleAddingBackgrounds(objects, isFullLayout, currentPosition, isLeftPage);

    if (isFullLayout || isHalfSheet(currentSheet.value)) {
      const objList = objects.map(obj => ({
        ...obj,
        id: getUniqueId()
      }));

      setObjects({ objectList: objList });
      return;
    }

    // Get object(s) rest
    const restObjs = objects.filter(obj => obj.type !== OBJECT_TYPE.BACKGROUND);
    const newObjects = restObjs.map(obj => ({
      ...obj,
      position: currentPosition,
      id: getUniqueId()
    }));

    const storeObjects = Object.values(cloneDeep(getObjects.value)).filter(
      obj => {
        if (isEmpty(obj)) return false;

        const x = obj.coord.x;

        const isKeepLeft = isRightPage && x < positionCenterX;
        const isKeepRight = isLeftPage && x >= positionCenterX;

        return isKeepLeft || isKeepRight;
      }
    );

    const objectList = [...newObjects, ...storeObjects];

    setObjects({ objectList });

    // Update sheet fields
    setSheetData({
      layoutId: layout.id,
      themeId,
      previewImageUrl: layout.previewImageUrl
    });
  };

  return { applyPrintLayout };
};

export const useApplyDigitalLayout = () => {
  const { currentSheet, frames: storeFrames } = useGetters({
    currentSheet: DIGITAL_GETTERS.CURRENT_SHEET,
    frames: DIGITAL_GETTERS.GET_ARRAY_FRAMES
  });

  const { setFrames, setCurrentFrameId, clearAllFrames } = useFrame();
  const { updateFrameOrder } = useFrameOrdering();
  const { createFrames } = useFrameAction();

  const applyDigitalLayout = async layout => {
    const { id: sheetId } = currentSheet.value;
    const transitions = layout.frames
      .map(({ transition }) => (transition ? transition : null))
      .filter(Boolean);

    // remove all primary frames
    const frames = cloneDeep(storeFrames.value);
    const finalFrames = frames.filter(frame => !frame.fromLayout);

    const primaryFrameIds = frames
      .filter(frame => frame.fromLayout)
      .map(f => f.id);

    await Promise.all(primaryFrameIds.map(id => deleteFrameApi(id)));

    // add new frames
    const newFrames = await createFrames(sheetId, layout);

    // reorder frames
    finalFrames.unshift(...newFrames);
    const frameIds = finalFrames.map(f => parseInt(f.id));
    await updateFrameOrder(sheetId, frameIds);

    // if length of layoutFrames > 1, means that it's package layout and there are transition
    // update transitions
    if (layout.frames.length > 1) {
      setTimeout(async () => {
        const transitionId = await getSheetTransitionApi(sheetId, true);

        if (isEmpty(transitionId)) return;

        await Promise.all(
          transitions.map((trans, idx) =>
            updateTransitionApi(transitionId[idx]?.id, trans, TRANS_TARGET.SELF)
          )
        );
      }, 1000);
    }

    clearAllFrames();
    setFrames({ framesList: finalFrames });

    setCurrentFrameId({ id: finalFrames[0].id });
    return finalFrames;
  };

  return { applyDigitalLayout };
};
