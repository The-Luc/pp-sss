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

// TODO later
const getObjectCoordByPositionPage = (
  objCoord,
  objSize,
  positionPage,
  targetCanvas,
  layoutSize
) => {
  const { width: canvasWidth, height: canvasHeight } = targetCanvas;
  const { width: layoutWidth, height: layoutHeight } = layoutSize;
  let left = 0;
  let top = 0;
  const ratioWidth = layoutWidth / canvasWidth;
  const ratioHeight = layoutHeight / canvasHeight;
  const centerLeftPoint = objSize.width / 2;
  const centerTopPoint = objSize.height / 2;
  if (positionPage === 'left') {
    left = objCoord.x * ratioWidth;
  }
  return {
    left,
    top: objCoord.y
  };
};

// TODO later
const handleDrawTextLayout = (page, position, targetCanvas, layoutSize) => {
  console.log('page', page);
  console.log('position', position);
  console.log('targetCanvas', targetCanvas);
  console.log('layoutSize', layoutSize);

  const textObjects = page.objects.filter(obj => obj.type === OBJECT_TYPE.TEXT);

  console.log('textObjects', textObjects);
  console.log('-----------------------------------------');
  if (textObjects.length > 0) {
    textObjects.forEach(obj => {
      const { width, height } = obj.size;
      const { rotation } = obj.coord;
      const { left, top } = getObjectCoordByPositionPage(
        obj.coord,
        obj.size,
        position,
        targetCanvas,
        layoutSize
      );
      console.log('top', top);
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
      const textObj = new fabric.Textbox(text, {
        // styleId: 'default'
        lockUniScaling: false,
        width,
        height,
        fontWeight: isBold ? 'bold' : 'normal',
        fontStyle: isItalic ? 'italic' : 'normal',
        underline: isUnderline,
        left,
        textAlign: 'left',
        top,
        rotate: rotation,
        fontFamily,
        fontSize,
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
 * Get background source from layout and draw it on target canvas by fabric
 * @param {Object} layoutData - Layout object
 * @param {String} position - Layout postion to draw // left or right
 * @param {Ref} targetCanvas - Target canvas to draw objects
 */
const handleDrawBackgroundLayout = (layoutData, position, targetCanvas) => {
  const backrgoundObj = layoutData?.objects.find(
    obj => obj.type === OBJECT_TYPE.BACKGROUND
  );
  const backgroundUrl = backrgoundObj?.property?.imageUrl;
  if (!backgroundUrl) {
    targetCanvas.clear().renderAll();
    return;
  }
  fabric.Image.fromURL(
    backgroundUrl,
    function(img) {
      img.selectable = false;
      img.left = position === 'right' ? targetCanvas.width / 2 : 0;
      img.scaleX = targetCanvas.width / img.width / 2;
      img.scaleY = targetCanvas.height / img.height;
      targetCanvas.add(img);
      targetCanvas.sendToBack(img);
    },
    {
      objectCaching: true
    }
  );
};

/**
 * Add objects by type to target canvas
 * @param {Object} layoutData - Layout object
 * @param {String} position - Layout postion to draw // left or right
 * @param {Ref} targetCanvas - Target canvas to draw objects
 * @param {Object} layoutSize - Layout object size
 */
const handleDrawLayout = (layoutData, position, targetCanvas, layoutSize) => {
  handleDrawBackgroundLayout(layoutData, position, targetCanvas);
  handleDrawTextLayout(layoutData, position, targetCanvas, layoutSize);
};

export const useDrawLayout = () => {
  /**
   * Draw layout by take left and right layout image data
   * @param {Object} layout - Layout object
   * @param {String} position - Layout postion to draw // left or right
   * @param {Ref} targetCanvas - Target canvas to draw objects
   */
  const drawLayout = (layout, position, targetCanvas = window.printCanvas) => {
    if (layout?.id) {
      const leftLayout = layout?.pages[0];
      const rightLayout = layout?.pages[1];
      handleDrawLayout(
        leftLayout,
        position || 'left',
        targetCanvas,
        layout.size
      );
      handleDrawLayout(
        rightLayout,
        position || 'right',
        targetCanvas,
        layout.size
      );
    } else {
      targetCanvas.clear().renderAll();
    }
  };

  return {
    drawLayout
  };
};
