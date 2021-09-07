import { fabric } from 'fabric';
import { OBJECT_TYPE } from '../constants';
import {
  ANIMATION_DIR,
  BLUR_DELAY_DURATION,
  DELAY_DURATION
} from '../constants/animationProperty';
import { applyTextBoxProperties } from '../fabricObjects';

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
    scaleX: scale,
    scaleY: scale,
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

  const center = element.getCenterPoint();
  const originTop = element.top;
  const originLeft = element.left;

  const animateProps = {
    opacity: 0,
    scaleX: scale,
    scaleY: scale
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
  if (!duration || !direction) return;

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
  if (!duration || !direction) return;

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
  if (!duration || !direction) return;

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
  if (!duration || !direction) return;

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
    startValue: 1,
    endValue: 0,
    isBlurIn: true
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
    endValue: 2,
    isBlurOut: true
  };

  handleBlurEffect(element, blurOption, canvas);
};

/**
 * Handle blur animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const handleBlurEffect = async (element, options, canvas) => {
  const { duration } = options;
  if (!duration) return;

  const blurValue = options.startValue;
  const offsetBlur = 300; // pixel

  //hide order boxes
  const { playIn, playOut } = hidePlayOrderBox(element);
  canvas.renderAll();

  const { img, imgTop, imgLeft } = await createImage(element, offsetBlur);

  const filter = new fabric.Image.filters.Blur({
    blur: blurValue
  });
  img.filters.push(filter);

  element.set({
    visible: options.isBlurOut ? true : false,
    hasControls: false,
    hasBorders: false
  });

  img.set({
    top: imgTop,
    left: imgLeft,
    blurValue,
    visible: false,
    fakeObject: true
  });

  canvas.add(img);
  canvas.renderAll();

  setTimeout(() => {
    element.set('visible', false);
    img.set('visible', true);
    img.animate(
      { blurValue: options.endValue },
      {
        duration,
        onChange: () => {
          filter.blur = img.blurValue;
          img.applyFilters();

          canvas.renderAll();
        },
        onComplete
      }
    );
  }, DELAY_DURATION);

  function onComplete() {
    canvas.remove(img);

    if (options.isBlurIn) {
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
 * @param {String} direction constant showing animation direction
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
 * To get object's bounding rectangle including shadow
 * @param {Object} obj fabric object
 * @returns bounding rec object including shadow
 */
const getObjectBounds = obj => {
  const bounds = obj.getBoundingRect(true);

  const shadow = obj.shadow || obj?.getObjects()[0]?.shadow;

  if (shadow === null) return bounds;

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
 * Create a image from fabric object
 * @param {Object} element fabric element
 * @param {Number} offsetBlur offsect to bouding box, this value ensure copping image capture blur effect
 * @returns {Object} a cropping image and its top left position
 */
const createImage = (element, offsetBlur) => {
  const bounds = getObjectBounds(element);
  const oriBounds = element.getBoundingRect(true);

  // cropTop and cropLeft are relative position to top left of the element
  const cropTop = bounds.top - oriBounds.top - offsetBlur;
  const cropLeft = bounds.left - oriBounds.left - offsetBlur;
  const cropWidth = bounds.width + 2 * offsetBlur;
  const cropHeight = bounds.height + 2 * offsetBlur;

  const imgTop = oriBounds.top + cropTop;
  const imgLeft = oriBounds.left + cropLeft;

  return new Promise(resolve => {
    element.cloneAsImage(img => resolve({ img, imgTop, imgLeft }), {
      top: cropTop,
      left: cropLeft,
      width: cropWidth,
      height: cropHeight
    });
  });
};

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

  const rect = element.getObjects()[0];
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

  if (isStop) return;

  const rect = element.getObjects()[0];
  return showPlayOrderBox(rect, playIn, playOut, true);
};
