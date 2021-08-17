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
      size: { width, height },
      type
    } = props;
    const { left, top, id, imageUrl } = fabricProp;

    const src =
      type === OBJECT_TYPE.IMAGE && imageUrl
        ? imageUrl
        : DEFAULT_IMAGE.IMAGE_URL;

    fabric.Image.fromURL(
      src,
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
 */
export const setImageSrc = async (imageObject, imageSrc) => {
  return new Promise(resolve => {
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
        height: img.height,
        thumbnail: null,
        playIcon: null,
        showThumbnail: false,
        type: OBJECT_TYPE.IMAGE
      };

      img.set(newProp);

      if (hasImage) {
        centercrop(imageObject, img.set.bind(img));
        newProp.zoomLevel = img.zoomLevel;
      }

      imageObject?.canvas?.renderAll();

      resolve(newProp);
    });
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
 */
export const centercrop = imageObject => {
  const ele = imageObject._element;
  if (!ele) return;

  const { width: elWidth, height: elHeight } = ele;
  const { width, height, scaleX, scaleY } = imageObject;

  const xZoom = (width * scaleX - elWidth) / elWidth;
  const yZoom = (height * scaleY - elHeight) / elHeight;
  const zoomLevel = Math.max(xZoom, yZoom);

  imageObject.set({ zoomLevel });
  imageObject?.canvas?.renderAll();

  return { zoomLevel };
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
    strokeWidth,
    cachedStrokeData: null
  });

  activeCanvas.renderAll();
};

/**
 * Create element for video object
 * @param {String} src video url
 * @return video element
 */
export const createVideoElement = src =>
  new Promise(resolve => {
    const ele = document.createElement('video');
    ele.addEventListener(
      'loadedmetadata',
      () => {
        ele.width = ele.videoWidth;
        ele.height = ele.videoHeight;
        resolve(ele);
      },
      false
    );
    ele.src = src;
  });

/**
 * Create element for video thumbnail
 * @param {String} src video's thumbnail url
 * @param {String} options video's thumbnail options
 * @return image element
 */
export const createVideoOverlay = (src, options) => {
  const ele = document.createElement('img');
  ele.src = src;

  if (options?.width) {
    ele.width = options.width;
  }

  if (options?.height) {
    ele.height = options.height;
  }

  return ele;
};

/**
 * Render video by video frames
 */
export const requestAnimFrame = () => {
  fabric.util.requestAnimFrame(function render() {
    activeCanvas.renderAll();
    const objects = activeCanvas.getObjects();
    const isPlaying = objects.some(obj => obj.isPlaying);
    if (isPlaying) {
      fabric.util.requestAnimFrame(render);
    }
  });
};

/**
 * Set video element for fabric image object
 * @param {Element} imageObject selected object to set video element
 * @param {String} videoSrc video url will be set to object
 * @param {String} thumbnailSrc video's thumbnail url will be set to object
 */
export const setVideoSrc = async (imageObject, videoSrc, thumbnailSrc) => {
  const { width, height, scaleX, scaleY } = imageObject;

  const element = await createVideoElement(videoSrc);

  element.addEventListener('play', () => {
    imageObject.set({ isPlaying: true, showThumbnail: false });
    requestAnimFrame();
  });

  element.addEventListener('pause', () => {
    imageObject.set({ isPlaying: false });
    if (element.currentTime === element.duration) {
      imageObject.set({ showThumbnail: true });
    }
    requestAnimFrame();
  });

  imageObject.setElement(element);

  const thumbnail = createVideoOverlay(thumbnailSrc);
  const playIcon = createVideoOverlay(IMAGE_LOCAL.PLAY_ICON, {
    width: 300,
    height: 300
  });

  const newScaleX = (width * scaleX) / element.width;
  const newScaleY = (height * scaleY) / element.height;

  const newProp = {
    scaleX: newScaleX,
    scaleY: newScaleY,
    with: element.width,
    height: element.height,
    hasImage: true,
    thumbnail,
    playIcon,
    showThumbnail: true,
    objectType: OBJECT_TYPE.VIDEO
  };

  imageObject.set(newProp);

  const { zoomLevel } = centercrop(
    imageObject,
    imageObject.set.bind(imageObject)
  );
  imageObject?.canvas?.renderAll();

  return {
    type: OBJECT_TYPE.VIDEO,
    imageUrl: videoSrc,
    thumbnailUrl: thumbnailSrc,
    zoomLevel
  };
};

/**
 * Handle click to play/pause video
 * @param {Object} target fabric object is focused
 */
export const handleClickVideo = target => {
  if (target?.objectType !== OBJECT_TYPE.VIDEO) return;
  if (target.isPlaying) {
    target.pause();
    return;
  }
  target.play();
};
