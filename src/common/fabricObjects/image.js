import { fabric } from 'fabric';

import {
  activeCanvas,
  getStrokeLineCap,
  inToPx,
  isEmpty,
  mapObject,
  pxToIn,
  scaleSize
} from '../utils';
import { DEFAULT_RULE_DATA } from './common';
import {
  DEFAULT_IMAGE,
  OBJECT_TYPE,
  IMAGE_LOCAL,
  IMAGE_INDICATOR
} from '../constants';

/**
 * Create new fabric image width initial properties
 * @param {Object} props initial properties of Image box
 * @returns {Object} instance of Image
 */
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
        const adjustedWidth = inToPx(width) || image.width;
        const adjustedHeight = inToPx(height) || image.height;
        const scaleX = adjustedWidth / image.width;
        const scaleY = adjustedHeight / image.height;

        image.set({ left, top, scaleX, scaleY });

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
 * Convert stored image properties to fabric properties
 *
 * @param   {Object}  prop  stored image properties
 * @returns {Object}        fabric properties
 */
export const toFabricImageProp = (prop, originalElement) => {
  const mapRules = {
    data: {
      type: DEFAULT_RULE_DATA.TYPE,
      x: DEFAULT_RULE_DATA.X,
      y: DEFAULT_RULE_DATA.Y,
      horizontal: DEFAULT_RULE_DATA.HORIZONTAL,
      vertical: DEFAULT_RULE_DATA.VERTICAL,
      width: {
        name: 'scaleX',
        parse: value => {
          if (originalElement) {
            return inToPx(value) / originalElement.width;
          }
          return 1;
        }
      },
      height: {
        name: 'scaleY',
        parse: value => {
          if (originalElement) {
            return inToPx(value) / originalElement.height;
          }
          return 1;
        }
      }
    },
    restrict: ['border', 'rotation', 'centerCrop']
  };
  return mapObject(prop, mapRules);
};

/**
 * Convert stored image border properties to fabric properties
 *
 * @param   {Object}  style stored image border properties
 * @returns {Object}        fabric properties
 */
export const toFabricImageBorderProp = prop => {
  const mapRules = {
    data: {
      strokeWidth: {
        name: 'strokeWidth',
        parse: value => scaleSize(value)
      }
    },
    restrict: [
      'id',
      'shadow',
      'size',
      'flip',
      'rotation',
      'isConstrain',
      'style'
    ]
  };

  return mapObject(prop, mapRules);
};

/**
 * Apply layout on an image
 * @param {Object} imageObject a fabric object
 * @param {Object} borderConfig border seting
 */
export const applyBorderToImageObject = (imageObject, borderConfig) => {
  const imageProp = toFabricImageBorderProp(borderConfig);

  const strokeLineCap = getStrokeLineCap(borderConfig.strokeLineType);

  imageObject.set({
    ...imageProp,
    strokeLineCap,
    dirty: true
  });
};

/**
 * Handle replace source url of Image box
 * @param {Element} imageObject object to replace source
 * @param {String} imageSrc Source image for replace
 * @param {Function} cb callback after replace image source
 */
export const setImageSrc = (imageObject, imageSrc, cb) => {
  const { width, height, scaleX, scaleY } = imageObject;
  const src = imageSrc || IMAGE_LOCAL.PLACE_HOLDER;
  const hasImage = !!imageSrc;

  imageObject.setSrc(src, img => {
    const newScaleX = (width * scaleX) / img.width;
    const newScaleY = (height * scaleY) / img.height;

    const newProp = {
      imageUrl: src,
      hasImage,
      scaleX: newScaleX,
      scaleY: newScaleY,
      with: img.width,
      height: img.height
    };

    img.set(newProp);
    if (hasImage) {
      centercrop(imageObject, img.set.bind(img));
      newProp.zoomLevel = img.zoomLevel;
    }
    imageObject.canvas.renderAll();
    cb && cb(newProp);
  });
};

/**
 * Handle to get list activate Image box
 * @returns {Array} List activate Image box
 */
export const getActivateImages = () => {
  return activeCanvas
    .getObjects()
    .filter(
      object => object.objectType === OBJECT_TYPE.IMAGE && !object.hasImage
    );
};

/**
 *
 * @param {Element} imageObject Source image for crop
 * @param {Function} cb callback after crop image
 */
export const centercrop = (imageObject, cb) => {
  const ele = imageObject._element;
  if (!ele) return;

  const { width: elWidth, height: elHeight } = ele;
  const { width, height, scaleX, scaleY } = imageObject;

  const xZoom = (width * scaleX - elWidth) / elWidth;
  const yZoom = (height * scaleY - elHeight) / elHeight;
  const zoomLevel = Math.max(xZoom, yZoom);

  imageObject.set({ zoomLevel });
  imageObject.canvas.renderAll();

  cb && cb({ zoomLevel });
};

/**
 * Handle when dragging over image box
 * @param {*} target - Image object has applied drag trigger
 */
export const handleDragEnter = ({ target }) => {
  const cachedStrokeData = {
    stroke: target.stroke,
    strokeWidth: target.strokeWidth
  };

  target.set({
    cachedStrokeData,
    stroke: IMAGE_INDICATOR.STROKE,
    strokeWidth: IMAGE_INDICATOR.STROKE_WIDTH
  });

  activeCanvas.renderAll();
};

/**
 * Handle when dragging leave image box
 * @param {*} target - Image object has applied drag trigger
 */
export const handleDragLeave = ({ target }) => {
  if (isEmpty(target.cachedStrokeData)) return;

  const { stroke, strokeWidth } = target.cachedStrokeData;
  target.set({
    stroke,
    strokeWidth
  });

  activeCanvas.renderAll();
};
