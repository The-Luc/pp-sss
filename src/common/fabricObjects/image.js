import { fabric } from 'fabric';

import { inToPx, pxToIn } from '../utils';
import {
  getAdjustedObjectDimension,
  toFabricImageProp,
  toFabricImageBorderProp
} from './common';
import { DEFAULT_IMAGE, BORDER_STYLES } from '../constants';

export const createImage = props => {
  return new Promise(resolve => {
    const fabricProp = toFabricImageProp(props);
    const {
      size: { width, height }
    } = props;
    const { left, top, id, imageUrl } = fabricProp;
    fabric.Image.fromURL(
      imageUrl || DEFAULT_IMAGE.IMAGE_URL,
      image => {
        const {
          width: adjustedWidth,
          height: adjustedHeight
        } = getAdjustedObjectDimension(image, inToPx(width), inToPx(height));

        image.set({
          left,
          top
        });

        image.scaleX = adjustedWidth / image.width;
        image.scaleY = adjustedHeight / image.height;
        resolve({
          object: image,
          size: { width: pxToIn(adjustedWidth), height: pxToIn(adjustedHeight) }
        });
      },
      {
        ...fabricProp,
        id,
        lockUniScaling: false,
        crossOrigin: 'anonymous'
      }
    );
  });
};

/**
 * Apply layout on an image
 * @param {Object} imageObject a fabric object
 * @param {Object} borderConfig border seting
 */
export const applyBorderToImageObject = (imageObject, borderConfig) => {
  const imageProp = toFabricImageBorderProp(borderConfig);

  const strokeWidth =
    imageProp.strokeLineType === BORDER_STYLES.ROUND
      ? imageProp.strokeWidth
      : imageProp.strokeWidth * 2;

  imageObject.set({
    ...imageProp,
    strokeWidth
  });
};
