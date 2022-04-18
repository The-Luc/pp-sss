import { fabric } from 'fabric';

import {
  HALF_SHEET,
  HALF_LEFT,
  OBJECT_TYPE,
  DEFAULT_FABRIC_BACKGROUND
} from '@/common/constants';

import { toFabricBackgroundProp } from './common';

import { isEmpty, isFullBackground, modifyUrl, inToPx } from '@/common/utils';

/**
 * Adding background to canvas
 *
 * @param {Number}  id                id of background
 * @param {Object}  backgroundProp    the property of adding background
 * @param {Boolean} isLeftBackground  is new background will be added to the left page
 * @param {String}  sheetType         type of container sheet
 * @param {Object}  canvas            the canvas contain new background
 */
export const addPrintBackground = async ({
  id,
  backgroundProp,
  isLeftBackground,
  sheetType,
  canvas
}) => {
  const background = await createBackgroundFabricObject(
    backgroundProp,
    canvas,
    id,
    isAddToLeft
  );
  const currentBackgrounds = canvas
    .getObjects()
    .filter(o => o.objectType === OBJECT_TYPE.BACKGROUND);

  const isAddingFullBackground = isFullBackground(backgroundProp);

  const isCurrentFullBackground =
    !isEmpty(currentBackgrounds) && isFullBackground(currentBackgrounds[0]);

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

  canvas.add(background);
  canvas.sendToBack(background);
};

/**
 * Adding background to canvas
 *
 * @param {Number}  id              id of background
 * @param {Object}  backgroundProp  the property of adding background
 * @param {Object}  canvas          the canvas contain new background
 */
export const addDigitalBackground = async ({ id, backgroundProp, canvas }) => {
  const background = await createBackgroundFabricObject(
    backgroundProp,
    canvas,
    id,
    true
  );

  const currentBackgrounds = canvas
    .getObjects()
    .filter(o => o.objectType === OBJECT_TYPE.BACKGROUND);

  currentBackgrounds.forEach(bg => canvas.remove(bg));

  canvas.add(background);
  canvas.sendToBack(background);
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
  isAddToLeft,
  scale,
  isDisplayHalftRight = false
) => {
  if (prop.size.width) {
    return createFitBackgrounds(prop, newId);
  }

  const fabricProp = toFabricBackgroundProp(prop);

  const { width, height } = canvas;
  const zoom = canvas.getZoom();

  const calcScaleX = isFullBackground(prop) ? 1 : 2;
  const scaleX = !isEmpty(scale) ? scale : calcScaleX;

  const id = newId ?? prop.id;
  const isLeftPage = isAddToLeft ?? prop.isLeftPage;
  const left = isLeftPage ? 0 : width / zoom / 2;

  return new Promise((resolve, reject) => {
    fabric.util.loadImage(
      modifyUrl(prop.imageUrl),
      img => {
        if (!img) {
          reject(new Error('Cannot load background'));
          return;
        }

        const background = new fabric.Image(img, {
          ...fabricProp,
          isLeftPage,
          id,
          selectable: false,
          left: isDisplayHalftRight ? -width / zoom : left,
          scaleX: width / zoom / img.width / scaleX,
          scaleY: height / zoom / img.height,
          ...DEFAULT_FABRIC_BACKGROUND
        });

        resolve(background);
      },
      null,
      {
        crossOrigin: 'anonymous'
      }
    );
  });
};

const createFitBackgrounds = (prop, newId) => {
  const fabricProp = toFabricBackgroundProp(prop);

  const id = newId ?? prop.id;
  const height = inToPx(prop.size.height);
  const width = inToPx(prop.size.width);

  return new Promise((resolve, reject) => {
    fabric.util.loadImage(
      modifyUrl(prop.imageUrl),
      img => {
        if (!img) {
          reject(new Error('Cannot load background'));
          return;
        }

        const background = new fabric.Image(img, {
          ...fabricProp,
          id,
          selectable: false,
          scaleX: width / img.width,
          scaleY: height / img.height,
          ...DEFAULT_FABRIC_BACKGROUND
        });

        resolve(background);
      },
      null,
      {
        crossOrigin: 'anonymous'
      }
    );
  });
};
