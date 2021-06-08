import { useMutations, useGetters } from 'vuex-composition-helpers';
import { fabric } from 'fabric';
import { pick, cloneDeep } from 'lodash';

import {
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES
} from '@/store/modules/book/const';
import {
  MUTATES as APP_MUTATES,
  GETTERS as APP_GETTERS
} from '@/store/modules/app/const';
import { OBJECT_TYPE, TOOL_NAME } from '@/common/constants';
import { scaleSize } from '@/common/utils';

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
 * @param {Array} objects - All objects user addeed
 */
const handleDrawTextLayout = (page, position, targetCanvas, objects) => {
  const objectIds = cloneDeep(page.objects);
  const objectsData = pick(objects, [...objectIds]);
  let res = {};
  let textObjects = [];
  Object.keys(objectsData).forEach(key => {
    if (objectsData[key].type === OBJECT_TYPE.TEXT) {
      res = objectsData[key];
      textObjects.push(res);
    }
  });
  Object.values(objectsData).forEach(obj => {
    if (obj.type === OBJECT_TYPE.TEXT) {
      const {
        coord: { x, y, rotation },
        size: { width, height }
      } = obj;
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

      let left = scaleSize(x);
      if (position === 'right') {
        const baseLeft = targetCanvas.width / targetCanvas.getZoom() / 2;
        left += baseLeft;
      }
      const textObj = new fabric.Textbox(text, {
        lockUniScaling: false,
        width: scaleSize(width),
        height: scaleSize(height),
        left,
        top: scaleSize(y),
        fontWeight: isBold ? 'bold' : 'normal',
        fontStyle: isItalic ? 'italic' : 'normal',
        underline: isUnderline,
        textAlign: 'left',
        rotate: rotation,
        fontFamily,
        fontSize: scaleSize(fontSize),
        isBold,
        isItalic,
        isUnderline,
        styleId,
        fill: color
      });
      targetCanvas.add(textObj);
    }
  });
};

/**
 * Get background source from page data and draw it on target canvas by fabric after that draw objects
 * @param {Object} pageData - Page object data
 * @param {String} position - Page position to draw left or right
 * @param {Ref} targetCanvas - Target canvas to draw objects
 * @param {Object} layoutSize - Layout object size
 * @param {Array} objects - All objects user addeed
 */
const handleDrawBackgroundLayout = (
  pageData,
  position,
  targetCanvas,
  layoutSize,
  objects
) => {
  const objectIds = cloneDeep(pageData.objects);
  const objectsData = pick(objects, [...objectIds]);
  const backrgoundObj = Object.values(objectsData).find(
    ({ type }) => type === OBJECT_TYPE.BACKGROUND
  );
  const backgroundUrl = backrgoundObj?.property?.imageUrl;
  if (pageData?.objects.length === 0) {
    targetCanvas?.clear().renderAll();
    return;
  }
  fabric.Image.fromURL(backgroundUrl, function(img) {
    const { width, height } = targetCanvas;
    const zoom = targetCanvas.getZoom();
    img.selectable = false;
    img.left = position === 'right' ? width / zoom / 2 : 0;
    img.scaleX = width / zoom / img.width / 2;
    img.scaleY = height / zoom / img.height;
    targetCanvas.add(img);
    handleDrawTextLayout(pageData, position, targetCanvas, objects);
  });
};

/**
 * Pass params to function objects to draw background
 * @param {Object} pageData - Page object data
 * @param {String} position - Page position to draw left or right
 * @param {Ref} targetCanvas - Target canvas to draw objects
 * @param {Object} layoutSize - Layout object size
 */
const handleDrawLayout = (
  pageData,
  position,
  targetCanvas,
  layoutSize,
  objects
) => {
  handleDrawBackgroundLayout(
    pageData,
    position,
    targetCanvas,
    layoutSize,
    objects
  );
};

export const useDrawLayout = () => {
  /**
   * Draw layout with layout data or reset canvas when layout not exist
   * @param {Object} layout - Layout object data
   * @param {Array} objects - All objects user addeed
   * @param {Ref} targetCanvas - Target canvas to draw objects
   */
  const drawLayout = (layout, objects, targetCanvas = window.printCanvas) => {
    if (layout?.id) {
      layout.pages.forEach((page, index) => {
        handleDrawLayout(
          page,
          index === 0 ? 'left' : 'right',
          targetCanvas,
          layout.size,
          objects
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
