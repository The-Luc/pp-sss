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
  IMAGE_INDICATOR,
  VIDEO_EVENT_TYPE
} from '../constants';

/**
 * Create new fabric image width initial properties
 * @param {Object} props initial properties of Image box
 * @returns {Object} instance of Image
 */
export const createImage = props => {
  return new Promise(resolve => {
    const fabricProp = toFabricMediaProp(props);
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
export const toFabricMediaProp = (prop, originalElement) => {
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
        width: img.width,
        height: img.height,
        objectType: OBJECT_TYPE.IMAGE
      };

      img.set(newProp);

      if (hasImage) {
        centercrop(imageObject, img.set.bind(img));
        newProp.zoomLevel = img.zoomLevel;
      }

      resolve({
        type: OBJECT_TYPE.IMAGE,
        hasImage,
        imageUrl: src,
        zoomLevel: newProp.zoomLevel
      });
    });
  });
};

/**
 * Handle to get list activate Image box
 * @returns {Array} List activate Image box
 */
export const getAvailableImages = () => {
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

  return { zoomLevel };
};

/**
 * Handle when dragging over image box
 * @param {*} target - Image object has applied drag trigger
 */
export const handleDragEnter = ({ target }) => {
  if (target.cachedStrokeData) return;

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

    ele.setAttribute('preload', 'metadata');

    ele.addEventListener(
      'loadedmetadata',
      () => {
        ele.width = ele.videoWidth;
        ele.height = ele.videoHeight;

        resolve(ele);
      },
      false
    );

    ele.src = `${src}#t=0.01`;
  });

/**
 * Create element for video thumbnail
 * @param {String} src video's thumbnail url
 * @param {String} options video's thumbnail options
 * @return image element
 */
export const createVideoOverlay = (src, options) => {
  return new Promise(resolve => {
    const ele = document.createElement('img');

    if (options?.width) {
      ele.width = options.width;
    }

    if (options?.height) {
      ele.height = options.height;
    }

    ele.onload = () => resolve(ele);

    ele.src = src;
  });
};

/**
 * Render video by video frames
 */
const reqAnimFrame = renderFn => {
  activeCanvas.renderAll();

  const objects = activeCanvas.getObjects();

  const isPlaying = objects.some(obj => obj.isPlaying);

  if (isPlaying) {
    fabric.util.requestAnimFrame(renderFn);
  }
};

/**
 * Render video by video frames
 */
export const requestAnimFrame = (isSeek = false) => {
  fabric.util.requestAnimFrame(function render() {
    if (!isSeek) {
      reqAnimFrame(render);

      return;
    }

    setTimeout(() => reqAnimFrame(render), 350);
  });
};

/**
 * Set video element for fabric image object
 * @param {Element} imageObject selected object to set video element
 * @param {String} videoSrc video url will be set to object
 * @param {String} thumbnailSrc video's thumbnail url will be set to object
 * @param {Function} videoStopCallback method call when video stop
 */
export const setVideoSrc = async (
  imageObject,
  videoSrc,
  thumbnailSrc,
  videoStopCallback
) => {
  const { width, height, scaleX, scaleY } = imageObject;

  const video = await createVideoElement(videoSrc);

  video.currentTime = 0;

  const unPlayProperties = {
    isPlaying: false,
    showPlayIcon: true,
    dirty: true
  };

  video.addEventListener(VIDEO_EVENT_TYPE.PLAY, () => {
    imageObject.set({
      isPlaying: true,
      showThumbnail: false,
      showPlayIcon: false,
      dirty: true
    });

    requestAnimFrame();
  });

  video.addEventListener(VIDEO_EVENT_TYPE.PAUSE, () => {
    if (video.isKeepRewind) return;

    imageObject.set(unPlayProperties);

    requestAnimFrame();
  });

  video.addEventListener(VIDEO_EVENT_TYPE.ENDED, () => {
    if (video.isKeepRewind) return;

    imageObject.set({
      ...unPlayProperties,
      showThumbnail: true
    });

    video.isTempPlaying = false;

    requestAnimFrame();

    videoStopCallback(imageObject.id);
  });

  video.addEventListener(VIDEO_EVENT_TYPE.SEEK, () => {
    if (!imageObject.isPlaying) {
      imageObject.set({
        showThumbnail: false,
        showPlayIcon: true,
        dirty: true
      });
    }

    requestAnimFrame(true);
  });

  video.addEventListener(VIDEO_EVENT_TYPE.REWIND, () => {
    imageObject.set({
      showThumbnail: false,
      showPlayIcon: false,
      dirty: true
    });

    requestAnimFrame();
  });

  video.addEventListener(VIDEO_EVENT_TYPE.END_REWIND, () => {
    imageObject.set(unPlayProperties);

    requestAnimFrame();
  });

  imageObject.setElement(video);

  const getThumbnail = createVideoOverlay(thumbnailSrc);

  const getPlayIcon = createVideoOverlay(IMAGE_LOCAL.PLAY_ICON, {
    width: 300,
    height: 300
  });

  const [thumbnail, playIcon] = await Promise.all([getThumbnail, getPlayIcon]);

  const newScaleX = (width * scaleX) / video.width;

  const newScaleY = (height * scaleY) / video.height;

  const newProp = {
    scaleX: newScaleX,
    scaleY: newScaleY,
    width: video.width,
    height: video.height,
    hasImage: true,
    thumbnail,
    playIcon,
    showThumbnail: true,
    showPlayIcon: true,
    thumbnailUrl: thumbnailSrc,
    objectType: OBJECT_TYPE.VIDEO
  };

  imageObject.set(newProp);

  const { zoomLevel } = centercrop(
    imageObject,
    imageObject.set.bind(imageObject)
  );

  return {
    type: OBJECT_TYPE.VIDEO,
    imageUrl: videoSrc,
    thumbnailUrl: thumbnailSrc,
    zoomLevel
  };
};

/**
 * Handle change media src in image box
 * @param {Element} target current image box will apply new src
 * @param {Object} options new prop for image box
 * @param {Function} videoStopCallback method call when video stop
 * @returns new properties of image box after change src
 */
export const handleChangeMediaSrc = async (
  target,
  options,
  videoStopCallback = null
) => {
  if (!target) return;

  const { imageUrl, id, mediaUrl, thumbUrl } = options;

  const prop = mediaUrl
    ? await setVideoSrc(target, mediaUrl, thumbUrl, videoStopCallback)
    : await setImageSrc(target, imageUrl);

  prop.imageId = id;

  return { id: target.id, prop };
};
