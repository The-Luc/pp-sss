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
import { inToPx, isEmpty } from '@/common/utils';
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
 * @param {Ref} targetCanvas - Target canvas to draw objects
 */
const handleDrawTextLayout = (objectsData, targetCanvas) => {
  if (isEmpty(objectsData)) {
    targetCanvas?.clear().renderAll();
    return;
  }
  Object.values(objectsData).forEach(obj => {
    if (obj.type === OBJECT_TYPE.TEXT) {
      const {
        coord: { x, y },
        size: { width, height }
      } = obj;

      let left = inToPx(x);
      if (obj.position === 'right') {
        const baseLeft = targetCanvas.width / targetCanvas.getZoom() / 2;
        left += baseLeft;
      }
      const { object } = createTextBox(
        left,
        inToPx(y),
        inToPx(width),
        inToPx(height),
        obj
      );
      targetCanvas.add(object);
    }
  });
};

/**
 * Draw background on target canvas by fabric
 * @param {Object} backgroundUrl - Background url
 * @param {String} position - Background's position
 * @param {Ref} targetCanvas - Target canvas to draw objects
 */
const handleDrawBackgroundLayout = (backgroundUrl, position, targetCanvas) => {
  if (!backgroundUrl) {
    targetCanvas?.clear().renderAll();
    return;
  }
  return new Promise(resolve => {
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
        img.opacity = 1;
        img.isLeftPage = position !== 'right';
        img.set(DEFAULT_FABRIC_BACKGROUND);
        targetCanvas.add(img);
        resolve();
      },
      {
        crossOrigin: 'anonymous'
      }
    );
  });
};

export const useDrawLayout = () => {
  /**
   * Draw layout with layout data or reset canvas when layout not exist
   * @param {Object} sheetPrintData - Layout object data
   * @param {Ref} targetCanvas - Target canvas to draw objects
   */
  const drawLayout = async (
    sheetPrintData,
    targetCanvas = window.printCanvas
  ) => {
    if (isEmpty(sheetPrintData)) {
      targetCanvas?.clear().renderAll(); // Clear canvas when click on empty spread
    } else {
      await Promise.all([
        handleDrawBackgroundLayout(
          sheetPrintData?.background?.left?.imageUrl,
          'left',
          targetCanvas
        ),
        handleDrawBackgroundLayout(
          sheetPrintData?.background?.right?.imageUrl,
          'right',
          targetCanvas
        )
      ]);
      handleDrawTextLayout(sheetPrintData.objects, targetCanvas);
    }
  };
  return {
    drawLayout
  };
};
