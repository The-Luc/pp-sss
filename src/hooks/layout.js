import { useMutations, useGetters } from 'vuex-composition-helpers';
import { fabric } from 'fabric';

import {
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES
} from '@/store/modules/book/const';
import {
  MUTATES as APP_MUTATES,
  GETTERS as APP_GETTERS
} from '@/store/modules/app/const';
import { OBJECT_TYPE, TOOL_NAME } from '@/common/constants';
import { PRINT_CANVAS_SIZE } from '@/common/constants/canvas';
import { computedObjectData } from '@/common/utils';

export const useLayoutPrompt = () => {
  const { isPrompt, pageSelected } = useGetters({
    isPrompt: APP_GETTERS.IS_PROMPT,
    pageSelected: BOOK_GETTERS.GET_PAGE_SELECTED
  });

  const { updateVisited, setIsPrompt, setToolNameSelected } = useMutations({
    updateVisited: BOOK_MUTATES.UPDATE_SHEET_VISITED,
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
 * @param {Object} page - Page data
 * @param {String} position - Page position to draw left or right
 * @param {Ref} targetCanvas - Target canvas to draw objects
 * @param {Object} layoutSize - Layout size include width and height
 */
const handleDrawTextLayout = (page, position, targetCanvas, layoutSize) => {
  const textObjects = page?.objects.filter(
    obj => obj.type === OBJECT_TYPE.TEXT
  );
  if (textObjects?.length > 0) {
    textObjects.forEach(obj => {
      const { rotation } = obj.coord;
      const {
        color,
        fontFamily,
        fontSize,
        isBold,
        isItalic,
        isUnderline,
        styleId,
        text
      } = obj.property;

      const { left, top, width, height } = computedObjectData(
        obj.coord,
        obj.size,
        targetCanvas,
        layoutSize,
        position
      );

      const fontSizeRatio =
        (targetCanvas.width / PRINT_CANVAS_SIZE.WIDTH) * fontSize;
      const textObj = new fabric.Textbox(text, {
        lockUniScaling: false,
        width,
        height,
        left,
        top,
        fontWeight: isBold ? 'bold' : 'normal',
        fontStyle: isItalic ? 'italic' : 'normal',
        underline: isUnderline,
        textAlign: 'left',
        rotate: rotation,
        fontFamily,
        fontSize: fontSizeRatio,
        isBold,
        isItalic,
        isUnderline,
        styleId,
        fill: color
      });
      targetCanvas.add(textObj);
    });
  }
};

/**
 * Get background source from page data and draw it on target canvas by fabric after that draw objects
 * @param {Object} pageData - Page object data
 * @param {String} position - Page position to draw left or right
 * @param {Ref} targetCanvas - Target canvas to draw objects
 * @param {Object} layoutSize - Layout object size
 */
const handleDrawBackgroundLayout = (
  pageData,
  position,
  targetCanvas,
  layoutSize
) => {
  const backrgoundObj = pageData?.objects?.find(
    obj => obj.type === OBJECT_TYPE.BACKGROUND
  );
  const backgroundUrl = backrgoundObj?.property?.imageUrl;
  if (!pageData?.objects) {
    targetCanvas?.clear().renderAll();
    return;
  }
  fabric.Image.fromURL(backgroundUrl, function(img) {
    img.selectable = false;
    img.left = position === 'right' ? targetCanvas.width / 2 : 0;
    img.scaleX = targetCanvas.width / img.width / 2;
    img.scaleY = targetCanvas.height / img.height;
    targetCanvas.add(img);
    handleDrawTextLayout(pageData, position, targetCanvas, layoutSize);
  });
};

/**
 * Pass params to function handleDrawBackgroundLayout to draw background
 * @param {Object} pageData - Page object data
 * @param {String} position - Page position to draw left or right
 * @param {Ref} targetCanvas - Target canvas to draw objects
 * @param {Object} layoutSize - Layout object size
 */
const handleDrawLayout = (pageData, position, targetCanvas, layoutSize) => {
  handleDrawBackgroundLayout(pageData, position, targetCanvas, layoutSize);
};

export const useDrawLayout = () => {
  /**
   * Draw layout with layout data or reset canvas when layout not exist
   * @param {Object} layout - Layout object data
   * @param {Ref} targetCanvas - Target canvas to draw objects
   */
  const drawLayout = (layout, targetCanvas = window.printCanvas) => {
    if (layout?.id) {
      layout.pages.forEach((page, index) => {
        handleDrawLayout(
          page,
          index === 0 ? 'left' : 'right',
          targetCanvas,
          layout.size
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
