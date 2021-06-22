import { useMutations, useGetters } from 'vuex-composition-helpers';
import { fabric } from 'fabric';

import {
  MUTATES as APP_MUTATES,
  GETTERS as APP_GETTERS
} from '@/store/modules/app/const';
import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';
import {
  OBJECT_TYPE,
  TOOL_NAME,
  DEFAULT_FABRIC_BACKGROUND
} from '@/common/constants';
import { scaleSize } from '@/common/utils';
import { createTextBox } from '@/common/fabricObjects';

export const useLayoutPrompt = () => {
  const { isPrompt, pageSelected } = useGetters({
    isPrompt: APP_GETTERS.IS_PROMPT,
    pageSelected: PRINT_GETTERS.CURRENT_SHEET
  });

  const { updateVisited, setIsPrompt, setToolNameSelected } = useMutations({
    updateVisited: PRINT_MUTATES.UPDATE_SHEET_VISITED,
    setIsPrompt: APP_MUTATES.SET_IS_PROMPT,
    setToolNameSelected: APP_MUTATES.SET_TOOL_NAME_SELECTED
  });

  const openPrompt = () => {
    setIsPrompt({ isPrompt: true });
    setToolNameSelected({ name: TOOL_NAME.LAYOUTS });
  };

  return {
    updateVisited,
    isPrompt,
    setIsPrompt,
    pageSelected,
    openPrompt
  };
};

/**
 * Get all text objects then draw it by fabric after that add to target canvas
 * @param {Object} objectsData - Page objects data
 * @param {String} position - Page position to draw left or right
 * @param {Ref} targetCanvas - Target canvas to draw objects
 * @param {Array} objects - All objects user addeed
 */
const handleDrawTextLayout = (objectsData, position, targetCanvas) => {
  objectsData.forEach(obj => {
    if (obj.type === OBJECT_TYPE.TEXT) {
      const {
        coord: { x, y },
        size: { width, height }
      } = obj;

      let left = scaleSize(x);
      if (position === 'right') {
        const baseLeft = targetCanvas.width / targetCanvas.getZoom() / 2;
        left += baseLeft;
      }
      const { object } = createTextBox(
        left,
        scaleSize(y),
        scaleSize(width),
        scaleSize(height),
        obj
      );
      targetCanvas.add(object);
    }
  });
};

/**
 * Get background source from page data and draw it on target canvas by fabric after that draw objects
 * @param {Object} objectsData - Page objects data
 * @param {String} position - Page position to draw left or right
 * @param {Ref} targetCanvas - Target canvas to draw objects
 */
const handleDrawBackgroundLayout = (objectsData, position, targetCanvas) => {
  const backrgoundObj = objectsData.find(
    ({ type }) => type === OBJECT_TYPE.BACKGROUND
  );
  const backgroundUrl = backrgoundObj?.imageUrl;
  if (objectsData.length === 0) {
    targetCanvas?.clear().renderAll();
    return;
  }

  fabric.Image.fromURL(
    backgroundUrl,
    function(img) {
      const { width, height } = targetCanvas;
      const zoom = targetCanvas.getZoom();
      img.selectable = false; // Right now, can not select background from layout, todo later
      img.left = position === 'right' ? width / zoom / 2 : 0;
      img.scaleX = width / zoom / img.width / 2;
      img.scaleY = height / zoom / img.height;

      img.objectType = OBJECT_TYPE.BACKGROUND;
      img.pageType = backrgoundObj?.pageType;
      img.opacity = 1;
      img.isLeftPage = position !== 'right';

      img.set(DEFAULT_FABRIC_BACKGROUND);

      targetCanvas.add(img);
      handleDrawTextLayout(objectsData, position, targetCanvas);
    },
    {
      crossOrigin: 'anonymous'
    }
  );
};

/**
 * Pass params to function objects to draw background
 * @param {Object} objectsData - Sheet objects data
 * @param {String} position - Page position to draw left or right
 * @param {Ref} targetCanvas - Target canvas to draw obj
 */
const handleDrawLayout = (objectsData, position, targetCanvas) => {
  handleDrawBackgroundLayout(objectsData, position, targetCanvas);
};

export const useDrawLayout = () => {
  /**
   * Draw layout with layout data or reset canvas when layout not exist
   * @param {Object} sheetPrintData - Layout object data
   * @param {Ref} targetCanvas - Target canvas to draw objects
   */
  const drawLayout = (sheetPrintData, targetCanvas = window.printCanvas) => {
    if (
      Array.isArray(sheetPrintData) &&
      sheetPrintData.length > 0 &&
      targetCanvas
    ) {
      sheetPrintData.forEach((objectData, index) => {
        handleDrawLayout(
          objectData,
          index === 0 ? 'left' : 'right',
          targetCanvas
        );
      });
    } else {
      targetCanvas?.clear().renderAll(); // Clear canvas when click on empty spread
    }
  };
  return {
    drawLayout
  };
};
