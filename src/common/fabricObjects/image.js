import { fabric } from 'fabric';

import { inToPx, toFabricImageProp } from '../utils';
import { getAdjustedObjectDimension } from './common';

export const createImage = props => {
  return new Promise(resolve => {
    const fabricProp = toFabricImageProp(props);
    const {
      size: { width, height }
    } = props;
    const { left, top, id, imageUrl } = fabricProp;
    fabric.Image.fromURL(
      imageUrl,
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
        resolve(image);
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
