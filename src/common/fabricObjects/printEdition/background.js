import { fabric } from 'fabric';

import {
  HALF_SHEET,
  HALF_LEFT,
  OBJECT_TYPE,
  BACKGROUND_PAGE_TYPE,
  DEFAULT_FABRIC_BACKGROUND
} from '@/common/constants';

import { updateElement, toFabricBackgroundProp } from '../common';

import { isEmpty } from '@/common/utils';

/**
 * Adding background to canvas
 *
 * @param {Number}  id                id of background
 * @param {Object}  backgroundProp    the property of adding background
 * @param {Boolean} isLeftBackground  is new background will be added to the left page
 * @param {String}  sheetType         type of container sheet
 * @param {Object}  canvas            the canvas contain new background
 */
export const addPrintBackground = ({
  id,
  backgroundProp,
  isLeftBackground,
  sheetType,
  canvas
}) => {
  const currentBackgrounds = canvas
    .getObjects()
    .filter(o => o.objectType === OBJECT_TYPE.BACKGROUND);

  const isAddingFullBackground =
    backgroundProp.pageType === BACKGROUND_PAGE_TYPE.FULL_PAGE.id;

  const isCurrentFullBackground =
    !isEmpty(currentBackgrounds) &&
    currentBackgrounds[0].pageType === BACKGROUND_PAGE_TYPE.FULL_PAGE.id;

  const isHalfSheet = HALF_SHEET.indexOf(sheetType) >= 0;
  const isHalfLeft = isHalfSheet && HALF_LEFT.indexOf(sheetType) >= 0;

  const isAddToLeftFullSheet =
    !isHalfSheet && (isAddingFullBackground || isLeftBackground);

  const isAddToLeft = isHalfLeft || isAddToLeftFullSheet;

  if (isHalfSheet || isAddingFullBackground || isCurrentFullBackground) {
    currentBackgrounds.forEach(bg => canvas.remove(bg));
  }

  if (!isAddingFullBackground && !isEmpty(currentBackgrounds)) {
    currentBackgrounds.forEach(bg => {
      if (bg.isLeftPage === isAddToLeft) canvas.remove(bg);
    });
  }

  createBackgroundFabricObject(backgroundProp, canvas, id, isAddToLeft).then(
    img => {
      canvas.add(img);
      canvas.sendToBack(img);
    }
  );
};
/**
 * to create an background object
 * @param {Object} prop background group
 * @returns fabric background object
 */
export const createBackgroundFabricObject = (
  prop,
  canvas,
  newId,
  isAddToLeft
) => {
  const fabricProp = toFabricBackgroundProp(prop);

  const { width, height } = canvas;
  const zoom = canvas.getZoom();
  const scaleX = prop.pageType === BACKGROUND_PAGE_TYPE.FULL_PAGE.id ? 1 : 2;

  const id = newId ?? prop.id;
  const isLeftPage = isAddToLeft ?? prop.isLeftPage;

  return new Promise(resolve => {
    fabric.Image.fromURL(prop.imageUrl, img => {
      img.set({
        ...fabricProp,
        isLeftPage,
        id,
        selectable: false,
        left: isLeftPage ? 0 : width / zoom / 2,
        scaleX: width / zoom / img.width / scaleX,
        scaleY: height / zoom / img.height,
        ...DEFAULT_FABRIC_BACKGROUND
      });

      resolve(img);
    });
  });
};

/**
 * Change property of background
 *
 * @param {Object}  background  the background will be change property
 * @param {Object}  prop        new property
 * @param {Object}  canvas      the canvas contain background
 */
export const updatePrintBackground = (background, prop, canvas) => {
  updateElement(background, prop, canvas);
};
