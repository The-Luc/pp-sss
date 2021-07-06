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
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';

import {
  OBJECT_TYPE,
  TOOL_NAME,
  DEFAULT_FABRIC_BACKGROUND,
  BACKGROUND_PAGE_TYPE
} from '@/common/constants';
import { inToPx } from '@/common/utils';
import { createTextBox } from '@/common/fabricObjects';
import { EDITION } from '@/common/constants/config';

export const useLayoutPrompt = edition => {
  const EDITION_GETTERS =
    edition === EDITION.PRINT ? PRINT_GETTERS : DIGITAL_GETTERS;
  const EDITION_MUTATES =
    edition === EDITION.PRINT ? PRINT_MUTATES : DIGITAL_MUTATES;

  const { isPrompt, pageSelected } = useGetters({
    isPrompt: APP_GETTERS.IS_PROMPT,
    pageSelected: EDITION_GETTERS.CURRENT_SHEET
  });

  const { updateVisited, setIsPrompt, setToolNameSelected } = useMutations({
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
    openPrompt
  };
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
  if (textObject.position === 'right') {
    const baseLeft = targetCanvas.width / targetCanvas.getZoom() / 2;
    left += baseLeft;
  }
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
      const scale =
        backgroundPageType === BACKGROUND_PAGE_TYPE.FULL_PAGE.id ? 1 : 2;

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
  const drawLayout = async (
    sheetPrintData,
    targetCanvas = window.printCanvas
  ) => {
    if (sheetPrintData.length === 0) {
      targetCanvas?.clear().renderAll(); // Clear canvas when click on empty spread
    } else {
      handleDrawObjects(sheetPrintData, targetCanvas);
    }
  };
  return {
    drawLayout
  };
};
