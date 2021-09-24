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

/**
 * Handle fade animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const fadeIn = (element, options, canvas) => {
  const { duration } = options;
  if (!duration) return;

  const config = {
    startState: {
      opacity: 0
    },
    animateProps: {
      opacity: getOriginalOpacity(element)
    },
    duration: duration
  };
  animationHandler(element, config, canvas);
};

/**
 * Handle fade animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const fadeOut = (element, options, canvas) => {
  const { duration } = options;
  if (!duration) return;

  const config = {
    animateProps: {
      opacity: 0
    },
    revertedProps: {
      opacity: getOriginalOpacity(element)
    },
    duration: duration
  };
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

  const config = {
    startState,
    animateProps,
    duration,
    revertedProps
  };

  animationHandler(element, config, canvas);
};

/**
 * Handle fade-scale animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const fadeScaleOut = (element, options, canvas) => {
  const { duration, scale } = options;
  if (!duration || typeof scale !== 'number') return;

  if (element.hasImage) {
    options.isPlayOut = true;
    handleFadeScaleImage(element, options, canvas);
    return;
  }

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

  const config = {
    startState,
    animateProps,
    duration,
    revertedProps
  };

  animationHandler(element, config, canvas);
};

/**
 * Handle slide animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const slideIn = (element, options, canvas) => {
  const { duration, direction } = options;
  if (!duration || isEmpty(direction)) return;

  const { oriPos, startPos, animatePropName } = calcSlideInPosition(
    element,
    direction,
    canvas
  );

  const config = {
    startState: {
      [animatePropName]: startPos
    },
    animateProps: {
      [animatePropName]: oriPos
    },
    duration
  };

  animationHandler(element, config, canvas);
};

/**
 * Handle slide animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const slideOut = (element, options, canvas) => {
  const { duration, direction } = options;
  if (!duration || isEmpty(direction)) return;

  const { oriPos, endPos, animatePropName } = calcSlideOutPosition(
    element,
    direction,
    canvas
  );

  const config = {
    animateProps: {
      [animatePropName]: endPos
    },
    revertedProps: {
      [animatePropName]: oriPos
    },
    duration
  };

  animationHandler(element, config, canvas);
};

/**
 * Handle fade-slide animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const fadeSlideIn = (element, options, canvas) => {
  const { duration, direction } = options;
  if (!duration || isEmpty(direction)) return;

  const { oriPos, startPos, animatePropName } = calcSlideInPosition(
    element,
    direction,
    canvas
  );

  const config = {
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

  animationHandler(element, config, canvas);
};

/**
 * Handle fade-slide animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const fadeSlideOut = (element, options, canvas) => {
  const { duration, direction } = options;
  if (!duration || isEmpty(direction)) return;

  const { oriPos, endPos, animatePropName } = calcSlideOutPosition(
    element,
    direction,
    canvas
  );

  const config = {
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

  animationHandler(element, config, canvas);
};

/**
 * Handle blur-in animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const blurIn = (element, options, canvas) => {
  const blurOption = {
    ...options,
    startValue: 1.3,
    endValue: 0,
    opacityStart: 0,
    opacityEnd: 1,
    isPlayIn: true
  };

  handleBlurEffect(element, blurOption, canvas);
};

/**
 * Handle blur-out animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const blurOut = (element, options, canvas) => {
  const blurOption = {
    ...options,
    startValue: 0,
    endValue: 1.3,
    opacityStart: 1,
    opacityEnd: 0,
    isPlayOut: true
  };

  handleBlurEffect(element, blurOption, canvas);
};

/**
 * Handle blur animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const handleBlurEffect = (element, options, canvas) => {
  const { duration, isPlayIn, isPlayOut } = options;
  if (!duration) return;

  const croppingOffset = 200; //pixel

  const startState = {
    blurValue: options.startValue,
    opacity: options.opacityStart
  };

  const animateProps = {
    blurValue: options.endValue,
    opacity: options.opacityEnd
  };

  const config = {
    startState,
    animateProps,
    croppingOffset,
    isBlur: true,
    duration,
    isPlayIn: Boolean(isPlayIn),
    isPlayOut: Boolean(isPlayOut)
  };

  handleEffectOnImage(element, config, canvas);
};

/**
 * Handle scale in animation of image
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const handleFadeScaleImage = (element, options, canvas) => {
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

  const config = {
    animateProps: isPlayIn ? visibleState : hiddenState,
    startState: isPlayIn ? hiddenState : visibleState,
    duration: options.duration,
    isPlayIn: Boolean(isPlayIn),
    isPlayOut: Boolean(isPlayOut)
  };

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

          showPlayOrderBox(element, playIn, playOut);

          canvas.renderAll();
        }, DELAY_DURATION);
      }
    });
  }, DELAY_DURATION);
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

export const renderOrderBoxes = objects => {
  const canvas = getActiveCanvas();
  canvas.getObjects().forEach(obj => obj.set({ selectable: false }));
  return Object.values(objects).map(renderOrderBox);
};

export const renderOrderBox = async data => {
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
      radius
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
      radius
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
