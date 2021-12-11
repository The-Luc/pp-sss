import { fabric } from 'fabric';

import {
  getActiveCanvas,
  getStrokeLineCap,
  getUniqueUrl,
  inToPx,
  isEmpty,
  mapObject,
  pxToIn,
  scaleSize
} from '../utils';
import { DEFAULT_RULE_DATA, applyShadowToObject } from './common';
import {
  DEFAULT_IMAGE,
  OBJECT_TYPE,
  IMAGE_LOCAL,
  IMAGE_INDICATOR,
  VIDEO_EVENT_TYPE,
  VIDEO_PLAY_ICON,
  CROP_CONTROL,
  DEFAULT_VIDEO,
  PORTRAIT_IMAGE_MASK
} from '../constants';
import {
  imageBorderModifier,
  renderImageCropControl,
  videoInitEvent,
  useObjectControlsOverride,
  useDoubleStroke
} from '@/plugins/fabric';
import { updateSpecificProp } from '@/common/fabricObjects';

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

    fabric.util.loadImage(
      getUniqueUrl(src),
      img => {
        const image = new fabric.Image(img, {
          ...fabricProp,
          id,
          lockUniScaling: false
        });

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
      null,
      {
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
      rotation: DEFAULT_RULE_DATA.ROTATION,
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
    restrict: ['border', 'cropInfo']
  };
  return mapObject(prop, mapRules);
};

/**
 * Convert stored image properties to fabric properties
 *
 * @param   {Object}  prop  stored image properties
 * @returns {Object}        fabric properties
 */
export const toFabricPortraitImageProp = prop => {
  const mapRules = {
    data: {
      type: DEFAULT_RULE_DATA.TYPE,
      x: DEFAULT_RULE_DATA.X,
      y: DEFAULT_RULE_DATA.Y,
      width: DEFAULT_RULE_DATA.WIDTH,
      height: DEFAULT_RULE_DATA.HEIGHT,
      rx: {
        name: 'rx',
        parse: inToPx
      },
      ry: {
        name: 'ry',
        parse: inToPx
      },
      horizontal: DEFAULT_RULE_DATA.HORIZONTAL,
      vertical: DEFAULT_RULE_DATA.VERTICAL,
      rotation: DEFAULT_RULE_DATA.ROTATION
    },
    restrict: ['border', 'shadow', 'cropInfo']
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
  const control = await createMediaOverlay(IMAGE_LOCAL.CONTROL_ICON, {
    width: CROP_CONTROL.WIDTH,
    height: CROP_CONTROL.HEIGHT
  });

  return new Promise(resolve => {
    const { width, height, scaleX, scaleY } = imageObject;
    const src = imageSrc || IMAGE_LOCAL.PLACE_HOLDER;
    const hasImage = !!imageSrc;

    imageObject.setSrc(
      getUniqueUrl(src),
      img => {
        const newScaleX = (width * scaleX) / img.width;
        const newScaleY = (height * scaleY) / img.height;

        const newProp = {
          imageUrl: src,
          hasImage,
          scaleX: newScaleX,
          scaleY: newScaleY,
          width: img.width,
          height: img.height,
          objectType: OBJECT_TYPE.IMAGE,
          control,
          showControl: false
        };

        img.set(newProp);

        applyShadowToObject(img, imageObject);

        if (hasImage) {
          centercrop(imageObject);
          newProp.zoomLevel = img.zoomLevel;
        }

        resolve({
          type: OBJECT_TYPE.IMAGE,
          hasImage,
          imageUrl: src,
          zoomLevel: newProp.zoomLevel
        });
      },
      {
        crossOrigin: 'anonymous'
      }
    );
  });
};

/**
 * Handle to get list activate Image box
 * @returns {Array} List activate Image box
 */
export const getAvailableImages = () => {
  return getActiveCanvas()
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
  if (target.cachedStrokeData || !target.selectable) return;

  const cachedStrokeData = {
    stroke: target.stroke,
    strokeWidth: target.strokeWidth
  };

  target.set({
    cachedStrokeData,
    stroke: IMAGE_INDICATOR.STROKE,
    strokeWidth: IMAGE_INDICATOR.STROKE_WIDTH
  });

  getActiveCanvas().renderAll();
};

/**
 * Handle when dragging leave image box
 * @param {*} target - Image object has applied drag trigger
 */
export const handleDragLeave = ({ target }) => {
  if (isEmpty(target.cachedStrokeData) || !target.selectable) return;

  const { stroke, strokeWidth } = target.cachedStrokeData;
  target.set({
    stroke,
    strokeWidth,
    cachedStrokeData: null
  });

  getActiveCanvas().renderAll();
};

/**
 * Handle hover on fabric object
 * @param {Object} event - Event when hover object
 */
export const handleMouseMove = event => {
  const target = event.target;

  if (target?.objectType === OBJECT_TYPE.IMAGE) {
    handleHoverImage(target);
  }

  if (target?.objectType === OBJECT_TYPE.VIDEO) {
    handleHoverVideo(target);
  }
};

/**
 * Handle when hover on control icon
 * @param {Object} target Fabric object selected
 */
const handleHoverImage = target => {
  if (!target.hasImage || !target.selectable) return;

  const { width, height, scaleX, scaleY, canvas } = target;

  const { x, y } = target.getLocalPointer();

  const zoom = canvas.getZoom();

  const eleWidth = width * scaleX;
  const eleHeight = height * scaleY;

  const iconDimension = eleWidth / 6;

  const controlEndX = eleWidth / 2;
  const controlStartX = controlEndX - iconDimension;

  const controlEndY = eleHeight - 15 / zoom;
  const controlStartY = controlEndY - iconDimension;

  const containPointerX = x >= controlStartX && x <= controlEndX;
  const containPointerY = y >= controlStartY && y <= controlEndY;

  const prop =
    containPointerX && containPointerY
      ? {
          hoverCursor: 'pointer',
          isHoverControl: true
        }
      : {
          hoverCursor: null,
          isHoverControl: false
        };

  target.set(prop);
};

/**
 * Handle when hover on play icon
 * @param {Object} target Fabric object selected
 */
const handleHoverVideo = target => {
  if (!target.showPlayIcon) {
    return target.set({
      hoverCursor: null,
      isHoverPlayIcon: false
    });
  }

  const { x, y } = target.getLocalPointer();
  const { width, height, scaleX, scaleY } = target;

  const startX = (width * scaleX - VIDEO_PLAY_ICON.WIDTH) / 2;
  const endX = startX + VIDEO_PLAY_ICON.WIDTH;

  const startY = (height * scaleY - VIDEO_PLAY_ICON.HEIGHT) / 2;
  const endY = startY + VIDEO_PLAY_ICON.HEIGHT;

  const containPointerX = x >= startX && x <= endX;
  const containPointerY = y >= startY && y <= endY;

  const prop =
    containPointerX && containPointerY
      ? {
          hoverCursor: 'pointer',
          isHoverPlayIcon: true
        }
      : {
          hoverCursor: null,
          isHoverPlayIcon: false
        };

  target.set(prop);
};

/**
 * Handle when hover image
 * @param {*} target - fabric object
 */
export const handleMouseOver = ({ target }) => {
  if (target?.objectType !== OBJECT_TYPE.IMAGE) return;

  renderImageCropControl(target);
};

/**
 * Handle when leave image
 * @param {*} target - fabric object
 */
export const handleMouseOut = ({ target }) => {
  if (
    target?.objectType !== OBJECT_TYPE.IMAGE ||
    !target.hasImage ||
    !target.selectable
  )
    return;

  target.set({
    showControl: false,
    dirty: true
  });

  target.canvas.renderAll();
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
export const createMediaOverlay = (src, options) => {
  return new Promise((resolve, reject) => {
    const ele = document.createElement('img');

    if (options?.width) {
      ele.width = options.width;
    }

    if (options?.height) {
      ele.height = options.height;
    }

    ele.onload = () => resolve(ele);
    ele.onerror = () => reject('Cannot load image');

    ele.crossOrigin = 'anonymous';
    ele.src = getUniqueUrl(src);
  });
};

/**
 * Render video by video frames
 */
const reqAnimFrame = renderFn => {
  getActiveCanvas().renderAll();

  const objects = getActiveCanvas().getObjects();

  const isPlaying = objects.some(obj => obj.isPlaying);

  if (isPlaying) {
    fabric.util.requestAnimFrame(renderFn);
  }
};

/**
 * Render video by video frames
 */
export const requestAnimFrame = (isSeek = false, obj = null) => {
  fabric.util.requestAnimFrame(function render() {
    if (obj) obj.set({ dirty: true });

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
 * @param {Function} videoToggleStatusCallback method call when video stop
 */
export const setVideoSrc = async (
  imageObject,
  videoSrc,
  thumbnailSrc,
  videoToggleStatusCallback
) => {
  const { width, height, scaleX, scaleY } = imageObject;

  if (imageObject.objectType === OBJECT_TYPE.VIDEO) {
    imageObject.dispose();

    imageObject.set({ volume: DEFAULT_VIDEO.VOLUME, isPlaying: false });
  }

  videoInitEvent(imageObject);

  const video = await createVideoElement(videoSrc);

  video.currentTime = 0;

  const volume = imageObject.get('volume');

  video.volume = (isEmpty(volume) ? DEFAULT_VIDEO.VOLUME : volume) / 100;

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

    requestAnimFrame(false, imageObject);
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

    video.currentTime = 0;

    requestAnimFrame();

    videoToggleStatusCallback(imageObject.id);
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

    videoToggleStatusCallback(imageObject.id);
  });

  video.addEventListener(VIDEO_EVENT_TYPE.TOGGLE_STATUS, () => {
    videoToggleStatusCallback(imageObject.id, imageObject.get('isPlaying'));
  });

  imageObject.setElement(video);

  const getThumbnail = createMediaOverlay(thumbnailSrc);

  const getPlayIcon = createMediaOverlay(IMAGE_LOCAL.PLAY_ICON, {
    width: VIDEO_PLAY_ICON.WIDTH,
    height: VIDEO_PLAY_ICON.HEIGHT
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

  applyShadowToObject(imageObject, imageObject);

  const { zoomLevel } = centercrop(imageObject);
  const duration = Math.ceil(video.duration);

  return {
    type: OBJECT_TYPE.VIDEO,
    imageUrl: videoSrc,
    thumbnailUrl: thumbnailSrc,
    zoomLevel,
    duration,
    endTime: duration
  };
};

/**
 * Handle change media src in image box
 * @param {Element} target current image box will apply new src
 * @param {Object} options new prop for image box
 * @param {Function} videoToggleStatusCallback method call when video stop
 * @returns new properties of image box after change src
 */
export const handleChangeMediaSrc = async (
  target,
  options,
  videoToggleStatusCallback = null
) => {
  if (!target) return;

  const { imageUrl, id, mediaUrl, thumbUrl } = options;

  const prop = mediaUrl
    ? await setVideoSrc(target, mediaUrl, thumbUrl, videoToggleStatusCallback)
    : await setImageSrc(target, imageUrl);

  prop.imageId = id;

  if (mediaUrl) {
    prop.volume = DEFAULT_VIDEO.VOLUME;
    prop.endTime = prop.duration;
    prop.startTime = 0;
  }

  return { id: target.id, prop };
};

/**
 * Create new fabric object width initial properties
 * @param {Object} props initial properties of portrait image
 * @returns {Object} instance of fabric object
 */
export const createPortraitImage = async props => {
  const {
    top,
    left,
    width,
    height,
    mask,
    imageUrl,
    objectType,
    id,
    fromPortrait
  } = toFabricPortraitImageProp(props);

  const radiusRatio = mask === PORTRAIT_IMAGE_MASK.ROUNDED ? 10 : 2;

  const rect = new fabric.Rect({
    id,
    top,
    left,
    width,
    height,
    rx: width / radiusRatio,
    ry: width / radiusRatio,
    mask,
    objectType,
    fill: 'transparent',
    strokeUniform: true,
    fromPortrait,
    imageUrl
  });

  try {
    const img = await createMediaOverlay(imageUrl);

    rect.set({ img });
    return rect;
  } catch (error) {
    throw new Error(error);
  }
};

export const createMediaObject = async (
  mediaProperties,
  videoToggleCallback
) => {
  const mediaObject = await createImage(mediaProperties);
  const media = mediaObject?.object;

  useObjectControlsOverride(media);

  const {
    border,
    hasImage,
    control,
    type,
    imageUrl,
    thumbnailUrl,
    customThumbnailUrl
  } = mediaProperties;

  if (type === OBJECT_TYPE.VIDEO) {
    const url = customThumbnailUrl || thumbnailUrl;

    await setVideoSrc(media, imageUrl, url, videoToggleCallback);
  }

  imageBorderModifier(media);

  const {
    dropShadow,
    shadowBlur,
    shadowOffset,
    shadowOpacity,
    shadowAngle,
    shadowColor
  } = media;

  applyShadowToObject(media, {
    dropShadow,
    shadowBlur,
    shadowOffset,
    shadowOpacity,
    shadowAngle,
    shadowColor
  });

  applyBorderToImageObject(media, border);

  updateSpecificProp(media, {
    coord: {
      rotation: mediaProperties.coord.rotation
    },
    cropInfo: mediaProperties.cropInfo
  });

  if (type === OBJECT_TYPE.IMAGE && hasImage && !control) {
    const control = await createMediaOverlay(IMAGE_LOCAL.CONTROL_ICON, {
      width: CROP_CONTROL.WIDTH,
      height: CROP_CONTROL.HEIGHT
    });

    media.set({ control });
  }

  return media;
};

export const createPortraitImageObject = async properties => {
  const image = await createPortraitImage(properties);

  const { border, shadow } = properties;

  useDoubleStroke(image);

  useObjectControlsOverride(image);

  applyShadowToObject(image, shadow);

  applyBorderToImageObject(image, border);

  return image;
};
