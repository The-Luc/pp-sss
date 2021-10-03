import { rotateIcon } from '@/plugins/fabric';
import { fabric } from 'fabric';
import { last } from 'lodash';
import { OBJECT_TYPE } from '../constants';
import {
  ANIMATION_DIR,
  BLUR_DELAY_DURATION,
  DELAY_DURATION
} from '../constants/animationProperty';

import { applyTextBoxProperties, createSVGElement } from '../fabricObjects';
import { isEmpty, getActiveCanvas } from '../utils';
import { inToPx } from './canvas';

import {
  PLAY_IN_STYLES,
  PLAY_OUT_STYLES
} from '@/common/constants/animationProperty';

/**
 * To get the config for blur animation
 *
 * @param {Object} options aniamtion option of an object
 * @returns {Object} config for anmation
 */
const getBlurConfig = options => {
  const { duration, isPlayIn, isPlayOut } = options;
  if (!duration) return;

  const croppingOffset = 200; //pixel

  const blurOption = isPlayIn
    ? { blurStart: 1.3, blurEnd: 0, opacityStart: 0, opacityEnd: 1 }
    : { blurStart: 0, blurEnd: 1.3, opacityStart: 1, opacityEnd: 0 };

  const startState = {
    blurValue: blurOption.blurStart,
    opacity: blurOption.opacityStart
  };

  const animateProps = {
    blurValue: blurOption.blurEnd,
    opacity: blurOption.opacityEnd
  };

  return {
    startState,
    animateProps,
    croppingOffset,
    isBlur: true,
    duration,
    isPlayIn: Boolean(isPlayIn),
    isPlayOut: Boolean(isPlayOut)
  };
};

/**
 * To get the config for fade in animation
 *
 * @param {Object} options aniamtion option of an object
 * @returns {Object} config for anmation
 */
const getFadeInConfig = (element, options) => {
  return {
    startState: {
      opacity: 0
    },
    animateProps: {
      opacity: getOriginalOpacity(element)
    },
    duration: options.duration
  };
};

/**
 * To get the config for fade and scale in animation
 *
 * @param {Object} options aniamtion option of an object
 * @returns {Object} config for anmation
 */
const getFadeScaleInConfig = (element, options) => {
  const { scale, duration } = options;
  const center = element.getCenterPoint();
  const originTop = element.top;
  const originLeft = element.left;

  const animateProps = {
    opacity: getOriginalOpacity(element),
    scaleX: element.scaleX ?? 1,
    scaleY: element.scaleY ?? 1
  };

  const startState = {
    opacity: 0,
    scaleX: element.scaleX * scale,
    scaleY: element.scaleY * scale,
    top: center.y,
    left: center.x,
    originX: 'center',
    originY: 'center'
  };

  const revertedProps = {
    originX: 'left',
    originY: 'top',
    top: originTop,
    left: originLeft
  };

  return {
    startState,
    animateProps,
    duration,
    revertedProps
  };
};

/**
 * To get the config for fade and slide in animation
 *
 * @param {Object} options aniamtion option of an object
 * @returns {Object} config for anmation
 */
const getFadeSlideInConfig = (element, options, canvas) => {
  const { direction, duration } = options;
  const { oriPos, startPos, animatePropName } = calcSlideInPosition(
    element,
    direction,
    canvas
  );

  return {
    startState: {
      [animatePropName]: startPos,
      opacity: 0
    },
    animateProps: {
      [animatePropName]: oriPos,
      opacity: getOriginalOpacity(element)
    },
    duration
  };
};

/**
 * To get the config for slide in animation
 *
 * @param {Object} options aniamtion option of an object
 * @returns {Object} config for anmation
 */
const getSlideInConfig = (element, options, canvas) => {
  const { duration, direction } = options;

  const { oriPos, startPos, animatePropName } = calcSlideInPosition(
    element,
    direction,
    canvas
  );

  return {
    startState: {
      [animatePropName]: startPos
    },
    animateProps: {
      [animatePropName]: oriPos
    },
    duration
  };
};

/**
 * To get the config for fade out animation
 *
 * @param {Object} options aniamtion option of an object
 * @returns {Object} config for anmation
 */
const getFadeOutConfig = (element, options) => {
  return {
    animateProps: {
      opacity: 0
    },
    revertedProps: {
      opacity: getOriginalOpacity(element)
    },
    duration: options.duration
  };
};

/**
 * To get the config for fade and scale out animation
 *
 * @param {Object} options aniamtion option of an object
 * @returns {Object} config for anmation
 */
const getFadeScaleOutConfig = (element, options) => {
  const { duration, scale } = options;
  const center = element.getCenterPoint();
  const originTop = element.top;
  const originLeft = element.left;

  const animateProps = {
    opacity: 0,
    scaleX: element.scaleX * scale,
    scaleY: element.scaleY * scale
  };

  const startState = {
    top: center.y,
    left: center.x,
    originX: 'center',
    originY: 'center'
  };

  const revertedProps = {
    opacity: getOriginalOpacity(element),
    scaleX: element.scaleX ?? 1,
    scaleY: element.scaleY ?? 1,
    originX: 'left',
    originY: 'top',
    top: originTop,
    left: originLeft
  };

  return {
    startState,
    animateProps,
    duration,
    revertedProps
  };
};

/**
 * To get the config for fade and slide out animation
 *
 * @param {Object} options aniamtion option of an object
 * @returns {Object} config for anmation
 */
const getFadeSlideOutConfig = (element, options, canvas) => {
  const { duration, direction } = options;

  const { oriPos, endPos, animatePropName } = calcSlideOutPosition(
    element,
    direction,
    canvas
  );

  return {
    animateProps: {
      [animatePropName]: endPos,
      opacity: 0
    },
    revertedProps: {
      [animatePropName]: oriPos,
      opacity: getOriginalOpacity(element)
    },
    duration
  };
};

/**
 * To get the config for slide out animation
 *
 * @param {Object} options aniamtion option of an object
 * @returns {Object} config for anmation
 */
const getSlideOutConfig = (element, options, canvas) => {
  const { duration, direction } = options;

  const { oriPos, endPos, animatePropName } = calcSlideOutPosition(
    element,
    direction,
    canvas
  );

  return {
    animateProps: {
      [animatePropName]: endPos
    },
    revertedProps: {
      [animatePropName]: oriPos
    },
    duration
  };
};

/**
 * To get the config for fade and scale animation on image
 *
 * @param {Object} options aniamtion option of an object
 * @returns {Object} config for anmation
 */
const getFadeScaleImageConfig = options => {
  const { scale, isPlayIn, isPlayOut } = options;

  const visibleState = {
    opacity: 1,
    scaleX: 1,
    scaleY: 1
  };

  const hiddenState = {
    opacity: 0,
    scaleX: scale,
    scaleY: scale
  };

  return {
    animateProps: isPlayIn ? visibleState : hiddenState,
    startState: isPlayIn ? hiddenState : visibleState,
    duration: options.duration,
    isPlayIn: Boolean(isPlayIn),
    isPlayOut: Boolean(isPlayOut)
  };
};

/**
 * To get config for particular animation
 *
 * @param {Object} element fabric element
 * @param {Object} config option for animation
 * @param {Object} canvas fabric canvas
 * @param {Boolean} isPlayIn is play in animation
 * @returns {Object} config object for selected animation
 */
const getAnimationConfig = (element, config, canvas, isPlayIn) => {
  const { style, scale } = config;
  const options = { ...config, scale: scale / 100 };

  if (isPlayIn) {
    if (style === PLAY_IN_STYLES.BLUR) {
      return getBlurConfig({ ...options, isPlayIn: true });
    }

    if (style === PLAY_IN_STYLES.FADE_IN) {
      return getFadeInConfig(element, options);
    }

    if (style === PLAY_IN_STYLES.FADE_SCALE) {
      if (element.hasImage)
        return getFadeScaleImageConfig({ ...options, isPlayIn: true });

      return getFadeScaleInConfig(element, options);
    }

    if (style === PLAY_IN_STYLES.FADE_SLIDE_IN) {
      return getFadeSlideInConfig(element, options, canvas);
    }

    if (style === PLAY_IN_STYLES.SLIDE_IN) {
      return getSlideInConfig(element, options, canvas);
    }
  }

  if (style === PLAY_OUT_STYLES.BLUR) {
    return getBlurConfig({ ...options, isPlayOut: true });
  }

  if (style === PLAY_OUT_STYLES.FADE_OUT) {
    return getFadeOutConfig(element, options);
  }

  if (style === PLAY_OUT_STYLES.FADE_SCALE) {
    if (element.hasImage)
      return getFadeScaleImageConfig({ ...options, isPlayOut: true });

    return getFadeScaleOutConfig(element, options);
  }

  if (style === PLAY_OUT_STYLES.FADE_SLIDE_OUT) {
    return getFadeSlideOutConfig(element, options, canvas);
  }

  if (style === PLAY_OUT_STYLES.SLIDE_OUT) {
    return getSlideOutConfig(element, options, canvas);
  }
};

/**
 * Handle fade animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const fadeIn = (element, options, canvas) => {
  const { duration } = options;
  if (!duration) return;

  const config = getFadeInConfig(element, options);

  animationHandler(element, config, canvas);
};

/**
 * Handle fade animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const fadeOut = (element, options, canvas) => {
  if (!options.duration) return;

  const config = getFadeOutConfig(element, options);

  animationHandler(element, config, canvas);
};

/**
 * Handle fade-scale animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const fadeScaleIn = (element, options, canvas) => {
  const { duration, scale } = options;
  if (!duration || typeof scale !== 'number') return;

  if (element.hasImage) {
    options.isPlayIn = true;
    handleFadeScaleImage(element, options, canvas);
    return;
  }
  const config = getFadeScaleInConfig(element, options);

  animationHandler(element, config, canvas);
};

/**
 * Handle fade-scale animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const fadeScaleOut = (element, options, canvas) => {
  if (!options.duration || typeof options.scale !== 'number') return;

  if (element.hasImage) {
    options.isPlayOut = true;
    handleFadeScaleImage(element, options, canvas);
    return;
  }

  const config = getFadeScaleOutConfig(element, options);

  animationHandler(element, config, canvas);
};

/**
 * Handle slide animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const slideIn = (element, options, canvas) => {
  if (!options.duration || isEmpty(options.direction)) return;

  const config = getSlideInConfig(element, options, canvas);

  animationHandler(element, config, canvas);
};

/**
 * Handle slide animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const slideOut = (element, options, canvas) => {
  if (!options.duration || isEmpty(options.direction)) return;

  const config = getSlideOutConfig(element, options, canvas);

  animationHandler(element, config, canvas);
};

/**
 * Handle fade-slide animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const fadeSlideIn = (element, options, canvas) => {
  if (!options.duration || isEmpty(options.direction)) return;

  const config = getFadeSlideInConfig(element, options, canvas);

  animationHandler(element, config, canvas);
};

/**
 * Handle fade-slide animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const fadeSlideOut = (element, options, canvas) => {
  if (!options.duration || isEmpty(options.direction)) return;

  const config = getFadeSlideOutConfig(element, options, canvas);
  animationHandler(element, config, canvas);
};

/**
 * Handle blur-in animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const blurIn = (element, options, canvas) => {
  const config = getBlurConfig({ ...options, isPlayIn: true });

  handleEffectOnImage(element, config, canvas);
};

/**
 * Handle blur-out animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const blurOut = (element, options, canvas) => {
  const config = getBlurConfig({ ...options, isPlayOut: true });

  handleEffectOnImage(element, config, canvas);
};

/**
 * Handle scale in animation of image
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const handleFadeScaleImage = (element, options, canvas) => {
  const config = getFadeScaleImageConfig(options);

  handleEffectOnImage(element, config, canvas);
};

/**
 * Handle animation which only can be done on image object
 * This function create a image from fabric object, then apply animation on it
 *
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const handleEffectOnImage = (element, options, canvas) => {
  const { duration, animateProps, startState, isBlur } = options;

  const offset = options.croppingOffset;

  //hide order boxes
  const { playIn, playOut } = hidePlayOrderBox(element);

  if (element.objectType === OBJECT_TYPE.VIDEO) {
    element.set({
      showPlayIcon: false
    });
  }

  canvas.renderAll();

  const img = createImage(element, offset);

  const filter = new fabric.Image.filters.Blur({
    blur: startState.blurValue || 0
  });

  if (isBlur) img.filters.push(filter);

  element.set({
    visible: options.isPlayOut ? true : false,
    hasControls: false,
    hasBorders: false
  });

  const centerPoint = element.getCenterPoint();

  img.set({
    ...startState,
    originX: 'center',
    originY: 'center',
    top: centerPoint.y,
    left: centerPoint.x,
    visible: false,
    fakeObject: true
  });

  canvas.insertAt(img, canvas.getObjects().indexOf(element));
  canvas.renderAll();

  setTimeout(() => {
    element.set('visible', false);
    img.set('visible', true);
    img.animate(animateProps, {
      duration,
      onChange: () => {
        if (options.isBlur) {
          filter.blur = img.blurValue;
          img.applyFilters();
        }

        canvas.renderAll();
      },
      onComplete
    });
  }, DELAY_DURATION);

  function onComplete() {
    canvas.remove(img);

    if (options.isPlayIn) {
      element.set({ visible: true });
    }
    setTimeout(() => {
      element.set({
        visible: true,
        hasControls: true,
        hasBorders: true
      });

      if (element.objectType === OBJECT_TYPE.VIDEO) {
        element.set({
          showPlayIcon: true
        });
      }

      showPlayOrderBox(element, playIn, playOut);

      canvas.renderAll();
    }, BLUR_DELAY_DURATION);
  }
};

export const animateIn = {
  fade: fadeIn,
  fadeScale: fadeScaleIn,
  fadeSlide: fadeSlideIn,
  slide: slideIn,
  blur: blurIn
};

export const animateOut = {
  fade: fadeOut,
  fadeScale: fadeScaleOut,
  fadeSlide: fadeSlideOut,
  slide: slideOut,
  blur: blurOut
};

// ============== HELPER FUNCTIONS ====================

/**
 * Handle render element on canvas with animation effects
 * @param {Object} element fabric object
 * @param {Object} config configuration for animation
 * @param {Object} canvas fabric canvas object
 */
const animationHandler = (element, config, canvas) => {
  const { startState, animateProps, duration, revertedProps = {} } = config;

  element.set(startState);
  element.set({
    hasControls: false,
    hasBorders: false
  });

  if (element.objectType === OBJECT_TYPE.VIDEO) {
    element.set({
      showPlayIcon: false
    });
  }

  const { playIn, playOut } = hidePlayOrderBox(element);

  canvas.renderAll();

  setTimeout(() => {
    element.animate(animateProps, {
      duration,
      onChange: canvas.renderAll.bind(canvas),
      onComplete: () => {
        setTimeout(() => {
          element.set(revertedProps).setCoords();

          if (element.objectType === OBJECT_TYPE.TEXT && animateProps.opacity) {
            applyTextBoxProperties(element, { opacity: animateProps.opacity });
          }
          element.set({
            hasControls: true,
            hasBorders: true
          });

          if (element.objectType === OBJECT_TYPE.VIDEO) {
            element.set({
              showPlayIcon: true
            });
          }
          showPlayOrderBox(element, playIn, playOut);

          canvas.renderAll();
        }, DELAY_DURATION);
      }
    });
  }, DELAY_DURATION);
};

/**
 * Handle render element on canvas with animation effects use for playback
 * @param {Object} element fabric object
 * @param {Object} config configuration for animation
 * @param {Object} canvas fabric canvas object
 */
const playbackHandler = (animateObjects, canvas, isPlayIn) => {
  if (isEmpty(animateObjects)) return;

  animateObjects.forEach(({ element, options }) => {
    const config = getAnimationConfig(element, options, canvas, isPlayIn);
    const { startState, animateProps, duration } = config;

    if (
      [PLAY_IN_STYLES.BLUR, PLAY_OUT_STYLES.BLUR].includes(options.style) ||
      element.hasImage
    ) {
      playbackImageHandler(element, config, canvas);
      return;
    }

    element.set(startState);
    element.set({ visible: true });

    element.animate(animateProps, {
      duration: duration * 1000,
      onChange: canvas.renderAll.bind(canvas)
    });
  });
};

/**
 * Handle animation which only can be done on image object
 * This function create a image from fabric object, then apply animation on it
 *
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const playbackImageHandler = (element, options, canvas) => {
  const { duration, animateProps, startState, isBlur } = options;

  element.set('visible', true);
  const img = createImage(element, options.croppingOffset);
  element.set('visible', false);

  const filter = new fabric.Image.filters.Blur({
    blur: startState.blurValue || 0
  });

  if (isBlur) img.filters.push(filter);

  const centerPoint = element.getCenterPoint();

  img.set({
    ...startState,
    originX: 'center',
    originY: 'center',
    top: centerPoint.y,
    left: centerPoint.x
  });

  canvas.insertAt(img, canvas.getObjects().indexOf(element));
  canvas.renderAll();

  img.animate(animateProps, {
    duration: duration * 1000,
    onChange: () => {
      if (options.isBlur) {
        filter.blur = img.blurValue;
        img.applyFilters();
      }

      canvas.renderAll();
    },
    onComplete: () => {
      canvas.remove(img);

      if (options.isPlayIn) {
        element.set({ visible: true });
      }
      canvas.renderAll();
    }
  });
};

/**
 *	To calculate starting position when slide animation take place
 *
 * @param {Object} element fabric object animating
 * @param {Number | String} direction constant showing animation direction
 * @param {Object} canvas fabric canvas
 * @returns an objects providing information for slide animation
 */
const calcSlideInPosition = (element, direction, canvas) => {
  const { top, left, width, height } = getObjectBounds(element);

  const { left: oriLeft, top: oriTop } = element;

  const horizontalAnimation = {
    oriPos: oriLeft,
    animatePropName: 'left'
  };

  const verticalAnimation = {
    oriPos: oriTop,
    animatePropName: 'top'
  };

  if (direction === ANIMATION_DIR.LEFT_RIGHT) {
    const startPos = -1 * Math.abs(left + width - oriLeft);

    return {
      ...horizontalAnimation,
      startPos
    };
  }
  if (direction === ANIMATION_DIR.RIGHT_LEFT) {
    const canvasWidth = canvas.getWidth() / canvas.getZoom();
    const startPos = Math.abs(left - oriLeft) + canvasWidth;

    return {
      ...horizontalAnimation,
      startPos
    };
  }
  if (direction === ANIMATION_DIR.TOP_BOTTOM) {
    const startPos = -1 * Math.abs(top + height - oriTop);

    return {
      ...verticalAnimation,
      startPos
    };
  }
  if (direction === ANIMATION_DIR.BOTTOM_TOP) {
    const canvasHeight = canvas.getHeight() / canvas.getZoom();
    const startPos = Math.abs(top - oriTop) + canvasHeight;

    return {
      ...verticalAnimation,
      startPos
    };
  }
};

/**
 *	To calculate ending position of sliding animation
 *
 * @param {Object} element fabric object animating
 * @param {String} direction constant showing animation direction
 * @param {Object} canvas fabric canvas
 * @returns an objects providing information for slide animation
 */
const calcSlideOutPosition = (element, direction, canvas) => {
  const { top, left, width, height } = getObjectBounds(element);

  const { left: oriLeft, top: oriTop } = element;

  const horizontalAnimation = {
    oriPos: oriLeft,
    animatePropName: 'left'
  };

  const verticalAnimation = {
    oriPos: oriTop,
    animatePropName: 'top'
  };

  if (direction === ANIMATION_DIR.LEFT_RIGHT) {
    const canvasWidth = canvas.getWidth() / canvas.getZoom();
    const endPos = Math.abs(left - oriLeft) + canvasWidth;

    return {
      ...horizontalAnimation,
      endPos
    };
  }
  if (direction === ANIMATION_DIR.RIGHT_LEFT) {
    const endPos = -1 * Math.abs(left + width - oriLeft);
    return {
      ...horizontalAnimation,
      endPos
    };
  }
  if (direction === ANIMATION_DIR.TOP_BOTTOM) {
    const canvasHeight = canvas.getHeight() / canvas.getZoom();
    const endPos = Math.abs(top - oriTop) + canvasHeight;

    return {
      ...verticalAnimation,
      endPos
    };
  }
  if (direction === ANIMATION_DIR.BOTTOM_TOP) {
    const endPos = -1 * Math.abs(top + height - oriTop);

    return {
      ...verticalAnimation,
      endPos
    };
  }
};

/**
 * Get shadow of object
 *
 * @param   {Object}  obj fabric object
 * @returns {Object}      shadow or null
 */
const getShadow = obj => {
  if (isEmpty(obj)) return null;

  if (!isEmpty(obj.shadow)) return obj.shadow;

  const isEmptySubObject = isEmpty(obj.getObjects) || isEmpty(obj.getObjects());

  return isEmptySubObject ? null : obj.getObjects()[0].shadow;
};

/**
 * To get object's bounding rectangle including shadow
 * @param {Object} obj fabric object
 * @returns bounding rec object including shadow
 */
const getObjectBounds = obj => {
  const bounds = obj.getBoundingRect(true);

  const shadow = getShadow(obj);

  if (!shadow) return bounds;

  const blur = shadow.blur;
  const signX = shadow.offsetX >= 0.0 ? 1.0 : -1.0;
  const signY = shadow.offsetY >= 0.0 ? 1.0 : -1.0;
  const offsetX = (shadow.offsetX + signX * blur) * Math.abs(obj.scaleX);
  const offsetY = (shadow.offsetY + signY * blur) * Math.abs(obj.scaleY);

  if (offsetX > 0) {
    bounds.width += offsetX;
  } else if (offsetX < 0) {
    bounds.width += Math.abs(offsetX);
    bounds.left -= Math.abs(offsetX);
  }

  if (offsetY > 0) {
    bounds.height += offsetY;
  } else if (offsetY < 0) {
    bounds.height += Math.abs(offsetY);
    bounds.top -= Math.abs(offsetY);
  }

  return bounds;
};

/**
 * To get opacity of an object such as textbox, image, shape
 * @param {Object} element fabric object
 * @returns Number opacity of the object
 */
const getOriginalOpacity = element =>
  element.opacity ?? element?.getObjects()[0]?.opacity ?? 1;

/**
 * To hide control border and order boxes on selected element
 *
 * @param {Object} element fabric element
 * @returns playOrder image
 */
const hidePlayOrderBox = (element, isStop) => {
  if (element.playIn) {
    const { playIn, playOut } = element;

    element.set({
      playIn: null,
      playOut: null,
      dirty: true
    });

    return { playIn, playOut };
  }
  if (isStop) return;

  const rect = element.getObject && element.getObjects()[0];

  if (!rect) return { playIn: null, playout: null };

  return hidePlayOrderBox(rect, true);
};

/**
 * To show control border and order boxes on selected element
 *
 * @param {Object} element fabric element
 * @param {Object} playIn HTML Image image of order box play in
 * @param {Object} playOut HTML Image image of order box play out
 * @param {Boolean} isStop a sign to stop the recursive
 */
const showPlayOrderBox = (element, playIn, playOut, isStop) => {
  if ('playIn' in element) {
    element.set({
      playIn,
      playOut,
      dirty: true
    });
  }

  const rect = element.getObject && element.getObjects()[0];

  if (isStop || !rect) return;

  return showPlayOrderBox(rect, playIn, playOut, true);
};

/**
 * Create a image from fabric object
 * @param {Object} element fabric element
 * @param {Number} offsetBlur offsect to bouding box, this value ensure copping image capture blur effect
 * @returns {Object} a cropping image and its top left position
 */
const createImage = (element, blurOffset) => {
  const canvasEl = toCanvasElement(element, blurOffset);

  return new fabric.Image(canvasEl);
};

/**
 * Create a canvas element from fabric object
 * @param {Object} element fabric element
 * @param {Number} offsetBlur offsect to bouding box, this value ensure copping image capture blur effect
 * @returns {Object} a cropping element of fabric object
 */
const toCanvasElement = (element, blurOffset) => {
  const origParams = fabric.util.saveObjectTransform(element);
  const originalGroup = element.group;
  const originalShadow =
    element.objectType === OBJECT_TYPE.TEXT
      ? element.getObjects()[0].shadow
      : element.shadow;

  delete element.group;

  const el = fabric.util.createCanvasElement();

  const boundingRect = element.getBoundingRect(true, true);
  const shadow = originalShadow;
  const shadowOffset = { x: 0, y: 0 };

  if (shadow) {
    const shadowBlur = shadow.blur;
    const scaling = shadow.nonScaling
      ? { scaleX: 1, scaleY: 1 }
      : element.getObjectScaling();

    // consider non scaling shadow.
    shadowOffset.x =
      2 *
      Math.round(Math.abs(shadow.offsetX) + shadowBlur) *
      Math.abs(scaling.scaleX);
    shadowOffset.y =
      2 *
      Math.round(Math.abs(shadow.offsetY) + shadowBlur) *
      Math.abs(scaling.scaleY);
  }

  const offset = blurOffset || 0;
  const width = boundingRect.width + shadowOffset.x + offset;
  const height = boundingRect.height + shadowOffset.y + offset;

  // if the current width/height is not an integer
  // we need to make it so.
  el.width = Math.ceil(width);
  el.height = Math.ceil(height);

  let canvas = new fabric.StaticCanvas(el, {
    enableRetinaScaling: false,
    renderOnAddRemove: false,
    skipOffscreen: false
  });
  canvas.backgroundColor = '#ffffff01';

  element.setPositionByOrigin(
    new fabric.Point(canvas.width / 2, canvas.height / 2),
    'center',
    'center'
  );

  const originalCanvas = element.canvas;
  canvas.add(element);

  const canvasEl = canvas.toCanvasElement();

  element.shadow = originalShadow;
  element.set('canvas', originalCanvas);

  if (originalGroup) {
    element.group = originalGroup;
  }
  element.set(origParams).setCoords();
  // canvas.dispose will call image.dispose that will nullify the elements
  // since this canvas is a simple element for the process, we remove references
  // to objects in this way in order to avoid object trashing.
  canvas._objects = [];
  canvas.dispose();
  canvas = null;

  return canvasEl;
};

/**
 * Render animation order boxes
 * @param {Array} objects list objects on the current frame
 * @param {String} selectedId object's id has been selected
 */
export const renderOrderBoxes = (objects, selectedId) => {
  const canvas = getActiveCanvas();
  canvas.getObjects().forEach(obj => obj.set({ selectable: false }));
  Object.values(objects).forEach(obj => {
    const opacity = !selectedId || obj.id === selectedId ? 1 : 0.5;
    renderOrderBox(obj, opacity);
  });
};

/**
 * Render object order box
 * @param {Object} data object data
 * @param {Number} opacity object opacity
 */
export const renderOrderBox = async (data, opacity) => {
  if (!data.type || data.type === OBJECT_TYPE.BACKGROUND) return;
  const canvas = getActiveCanvas();
  const ctx = canvas.getContext('2d');
  const eleWidth = 40;
  const eleHeight = 40;
  const {
    size: { width },
    coord: { x, y, rotation = 0 },
    playIn = 1,
    playOut = 1
  } = data;

  const zoom = canvas.getZoom();
  const angle = (Math.PI * (rotation % 360)) / 180;

  if (playIn) {
    const ele = await createSVGElement(playIn, 'white');
    const radius = inToPx(width) - ele.width * 2;

    rotateIcon(
      ctx,
      ele,
      inToPx(y),
      inToPx(x),
      eleWidth,
      eleHeight,
      zoom,
      angle,
      radius,
      opacity
    );
  }
  if (playOut) {
    const ele = await createSVGElement(playOut, 'lightgray');
    const radius = inToPx(width) - eleWidth;

    rotateIcon(
      ctx,
      ele,
      inToPx(y),
      inToPx(x),
      eleWidth,
      eleHeight,
      zoom,
      angle,
      radius,
      opacity
    );
  }
};

export const removeAnimationOrders = (animationOrders, objectIds, objects) => {
  objectIds.forEach(id => {
    const idsIndex = animationOrders.findIndex(ids => ids.includes(id));

    if (idsIndex < 0) return;

    const ids = animationOrders[idsIndex];

    const index = ids.findIndex(i => +i === +id);
    ids.splice(index, 1);
  });

  const totalObjects = [].concat(...animationOrders).length;

  if (animationOrders.length <= totalObjects) return animationOrders;

  const diff = animationOrders.length - totalObjects;

  for (let i = 0; i < diff; i++) {
    const lastItems = [...last(animationOrders)];
    animationOrders.pop();
    last(animationOrders)?.push(...lastItems);
  }

  return sortAnimationOrder(animationOrders, objects);
};

export const sortAnimationOrder = (animationOrders, objects) => {
  const sortOrderList = [
    OBJECT_TYPE.TEXT,
    OBJECT_TYPE.IMAGE,
    OBJECT_TYPE.PORTRAIT_IMAGE,
    OBJECT_TYPE.VIDEO,
    OBJECT_TYPE.CLIP_ART,
    OBJECT_TYPE.SHAPE
  ];

  return animationOrders.map(ids => {
    return ids.sort((first, second) => {
      const firstObjType = objects[first]?.type;
      const secondObjType = objects[second]?.type;

      return (
        sortOrderList.indexOf(firstObjType) -
        sortOrderList.indexOf(secondObjType)
      );
    });
  });
};

///====================TEMP===========
const multiObjectsAnimation = (objects, canvas, orders, isPlayIn) => {
  const fbObjects = canvas.getObjects();
  let timeCounter = 0;
  const animationType = isPlayIn ? 'animationIn' : 'animationOut';

  // loop through orders
  orders.forEach(order => {
    let max = 0;
    const animateObjects = [];

    order.forEach(id => {
      // find max duration
      const animationOpt = objects[id][animationType];

      if (!animationOpt.style) return;

      max = Math.max(animationOpt.duration, max);

      const fbObject = fbObjects.find(o => o.id === id);
      animateObjects.push({ element: fbObject, options: animationOpt });
    });
    // call function to perform animation
    setTimeout(() => {
      playbackHandler(animateObjects, canvas, isPlayIn);
    }, timeCounter * 1000);

    // keep track of current order moment
    timeCounter += max;
  });

  return timeCounter;
};

export const playbackCoordinator = (
  objects,
  canvas,
  playInIds,
  playOutIds,
  delay
) => {
  const delayDuration = delay || 3;

  preprocessingObjects(objects, canvas);

  // Handle play in animation
  const playInDuration = multiObjectsAnimation(
    objects,
    canvas,
    playInIds,
    true
  );

  const startPlayOut = delayDuration + playInDuration;

  setTimeout(() => {
    // Handle play out animation
    multiObjectsAnimation(objects, canvas, playOutIds);
  }, startPlayOut * 1000);
};

const preprocessingObjects = (objects, canvas) => {
  canvas.discardActiveObject();

  const nonAnimationObjectIds = Object.values(objects)
    .filter(o => o.animationIn.style)
    .map(o => o.id);

  const fbObjects = canvas.getObjects();
  fbObjects.forEach(
    o => nonAnimationObjectIds.includes(o.id) && o.set({ visible: false })
  );

  canvas.renderAll();
};
