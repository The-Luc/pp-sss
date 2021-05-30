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
import { TOOL_NAME } from '@/common/constants';

export const useLayoutPrompt = () => {
  const { checkSheetIsVisited, isPrompt, pageSelected } = useGetters({
    checkSheetIsVisited: BOOK_GETTERS.SHEET_IS_VISITED,
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
    checkSheetIsVisited,
    updateVisited,
    isPrompt,
    setIsPrompt,
    pageSelected,
    openPrompt
  };
};
/**
 * Using fabric to clear if image empty or read file
 * @param {String} imgSrc - Layout image source
 * @param {Function} callback - Callback function after get image data from fabric
 */
const handleDrawLayout = (imgSrc, callback) => {
  if (!imgSrc) {
    window.printCanvas.clear().renderAll();
    return;
  }
  fabric.Image.fromURL(require(`@/assets/image/layouts/${imgSrc}`), function(
    img
  ) {
    callback(img);
  });
};

export const useDrawLayout = () => {
  /**
   * Draw layout by take left and right layout image data
   * @param {String} leftLayout - Layout left image source
   * @param {String} rightLayout - Layout right image source
   */
  const drawLayout = (leftLayout, rightLayout) => {
    handleDrawLayout(leftLayout, img => {
      img.selectable = false;
      img.scaleX = window.printCanvas.width / img.width / 2;
      img.scaleY = window.printCanvas.height / img.height;
      window.printCanvas.add(img);
    });

    handleDrawLayout(rightLayout, img => {
      img.selectable = false;
      img.left = window.printCanvas.width / 2;
      img.scaleX = window.printCanvas.width / img.width / 2;
      img.scaleY = window.printCanvas.height / img.height;
      window.printCanvas.add(img);
    });
  };

  return {
    drawLayout
  };
};
