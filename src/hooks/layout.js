import { useMutations, useGetters, useActions } from 'vuex-composition-helpers';
import { fabric } from 'fabric';

import {
  getPrintLayoutTypes,
  getDigitalLayoutTypes,
  getCustom,
  getLayoutsByThemeAndType,
  getCustomAndFavoriteLayouts,
  getFavoriteLayoutTypeMenu
} from '@/api/layoutService';

import {
  saveToFavorites as saveToFavoritesApi,
  getFavorites as getFavoritesApi
} from '@/api/user';
import { getLayoutElements } from '@/api/layout';

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
  MUTATES as DIGITAL_MUTATES,
  ACTIONS as DIGITAL_ACTIONS
} from '@/store/modules/digital/const';

import {
  OBJECT_TYPE,
  TOOL_NAME,
  DEFAULT_FABRIC_BACKGROUND,
  EDITION
} from '@/common/constants';

import { inToPx, isFullBackground, isOk } from '@/common/utils';
import { createTextBox } from '@/common/fabricObjects';

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
export const useLayoutElements = () => ({ getLayoutElements });

/**
 * to return the getters digital layout
 * @returns getters
 */
const getterDigitalLayout = () => {
  const { sheetLayout, getLayoutsByType, listLayouts } = useGetters({
    sheetLayout: DIGITAL_GETTERS.SHEET_LAYOUT,
    getLayoutsByType: THEME_GETTERS.GET_DIGITAL_LAYOUT_BY_TYPE,
    listLayouts: THEME_GETTERS.GET_DIGITAL_LAYOUTS_BY_THEME_ID
  });

  const { updateSheetThemeLayout } = useActions({
    updateSheetThemeLayout: DIGITAL_ACTIONS.UPDATE_SHEET_THEME_LAYOUT
  });

  return { sheetLayout, getLayoutsByType, listLayouts, updateSheetThemeLayout };
};

/**
 * to return the getters print layout
 * @returns getters
 */
const getterPrintLayout = () => {
  const { sheetLayout, getLayoutsByType, listLayouts } = useGetters({
    sheetLayout: PRINT_GETTERS.SHEET_LAYOUT,
    getLayoutsByType: THEME_GETTERS.GET_PRINT_LAYOUT_BY_TYPE,
    listLayouts: THEME_GETTERS.GET_PRINT_LAYOUTS_BY_THEME_ID
  });

  const { updateSheetThemeLayout } = useActions({
    updateSheetThemeLayout: PRINT_ACTIONS.UPDATE_SHEET_THEME_LAYOUT
  });

  return { sheetLayout, getLayoutsByType, listLayouts, updateSheetThemeLayout };
};
/**
 * Draw text by fabric after that add to target canvas
 * @param {Object} textObject - Page objects data
 * @param {Ref} targetCanvas - Target canvas to draw objects
 * @param {Number} index - Index/order of object
 */
const handleDrawTextLayout = (textObject, targetCanvas, index) => {
  const {
    coord: { x, y },
    size: { width, height }
  } = textObject;
  let left = inToPx(x);
  const { object } = createTextBox(
    left,
    inToPx(y),
    inToPx(width),
    inToPx(height),
    textObject
  );
  targetCanvas.add(object);
  targetCanvas.moveTo(object, index);
};

/**
 * Draw background on target canvas by fabric
 * @param {String} backgroundUrl - Background url
 * @param {String} position - Background's position
 * @param {Ref} targetCanvas - Target canvas to draw objects
 * @param {Number} index - Index/order of object
 */
const handleDrawBackgroundLayout = (
  id,
  backgroundUrl,
  backgroundPageType,
  position,
  targetCanvas,
  index
) => {
  if (!backgroundUrl) {
    targetCanvas?.clear().renderAll();
    return;
  }
  fabric.Image.fromURL(
    backgroundUrl,
    function(img) {
      const { width, height } = targetCanvas;
      const zoom = targetCanvas.getZoom();
      const scale = isFullBackground({ pageType: backgroundPageType }) ? 1 : 2;

      img.id = id;
      img.selectable = false; // Right now, can not select background from layout, todo later
      img.left = position === 'right' ? width / zoom / 2 : 0;
      img.scaleX = width / zoom / img.width / scale;
      img.scaleY = height / zoom / img.height;
      img.objectType = OBJECT_TYPE.BACKGROUND;
      img.opacity = 1;
      img.isLeftPage = position !== 'right';

      img.set(DEFAULT_FABRIC_BACKGROUND);

      targetCanvas.add(img);
      targetCanvas.moveTo(img, index);
    },
    {
      crossOrigin: 'anonymous'
    }
  );
};

/**
 * Loop through objects and draw object base on type
 * @param {Array} objects - Sheet's objects
 * @param {Ref} targetCanvas - Target canvas to draw objects
 */
const handleDrawObjects = (objects, targetCanvas) => {
  objects.forEach((obj, index) => {
    if (obj.type === OBJECT_TYPE.BACKGROUND) {
      const position = obj.isLeftPage ? 'left' : 'right';
      handleDrawBackgroundLayout(
        obj.id,
        obj.imageUrl,
        obj.pageType,
        position,
        targetCanvas,
        index
      );
    }

    if (obj.type === OBJECT_TYPE.TEXT) {
      handleDrawTextLayout(obj, targetCanvas, index);
    }
  });
};

export const useDrawLayout = () => {
  /**
   * Draw layout with layout data or reset canvas when layout not exist
   * @param {Object} sheetPrintData - Layout object data
   * @param {Ref} targetCanvas - Target canvas to draw objects
   */
  const drawLayout = async (sheetData, edition) => {
    const targetCanvas =
      edition === EDITION.DIGITAL ? window.digitalCanvas : window.printCanvas;

    if (sheetData.length === 0) {
      targetCanvas?.clear().renderAll(); // Clear canvas when click on empty spread
    } else {
      if (!targetCanvas) return;

      handleDrawObjects(sheetData, targetCanvas);
    }
  };
  return {
    drawLayout
  };
};

export const useActionLayout = () => {
  const saveToFavorites = async id => {
    const res = await saveToFavoritesApi(id);

    return isOk(res);
  };

  const getFavorites = async () => {
    const res = await getFavoritesApi();

    if (!isOk(res)) return [];

    return res.data.template_favourites.map(({ id }) => id);
  };

  return {
    saveToFavorites,
    getFavorites,
    getPrintLayoutTypes,
    getDigitalLayoutTypes,
    getCustom,
    getLayoutsByThemeAndType,
    getCustomAndFavoriteLayouts,
    getFavoriteLayoutTypeMenu
  };
};
