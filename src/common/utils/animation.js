import { fabric } from 'fabric';
import { OBJECT_TYPE } from '../constants';
import { applyTextBoxProperties } from '../fabricObjects';

// TODO: -Luc: Will be deleted later when integrate with An's code
const ANIMATION_DIR = {
  LEFT_RIGHT: 'leftToRight',
  RIGHT_LEFT: 'rightToLeft',
  TOP_BOTTOM: 'topToBottom',
  BOTTOM_TOP: 'bottomToTop'
};
const DELAY_DURATION = 500;
// ========================

/**
 * Handle fade animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const fade = (element, options, canvas) => {
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
 * Handle fade-scalde animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const fadeScale = (element, options, canvas) => {
  const { duration, scale } = options;
  if (!duration || !scale) return;

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
 * Handle slide animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const slide = (element, options, canvas) => {
  const { duration, direction } = options;
  if (!duration || !direction) return;

  const { oriPos, startPos, animatePropName } = calcSlidePosition(
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
 * Handle fade-slide animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const fadeSlide = (element, options, canvas) => {
  const { duration, direction } = options;
  if (!duration || !direction) return;

  const { oriPos, startPosForFade, animatePropName } = calcSlidePosition(
    element,
    direction,
    canvas
  );

  const config = {
    startState: {
      [animatePropName]: startPosForFade,
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
 * Handle blur animation
 * @param {Object} element fabric object animating
 * @param {Object} options animation option
 * @param {Object} canvas fabric canvas
 */
const blur = (element, options, canvas) => {
  const { duration } = options;
  if (!duration) return;

  const blurValue = 1;
  const offsetBlur = 300; // pixel

  const bounds = getObjectBounds(element);

  let img;

  const cropTop = bounds.top - element.top - offsetBlur;
  const cropLeft = bounds.left - element.left - offsetBlur;
  const cropWidth = bounds.width + 2 * offsetBlur;
  const cropHeight = bounds.height + 2 * offsetBlur;

  element.cloneAsImage(image => (img = image), {
    top: cropTop,
    left: cropLeft,
    width: cropWidth,
    height: cropHeight
  });

  const filter = new fabric.Image.filters.Blur({
    blur: blurValue
  });
  img.filters.push(filter);

  element.set({ visible: false, hasControls: false, hasBorders: false });

  img.set({
    top: element.top + cropTop,
    left: element.left + cropLeft,
    blurValue,
    visible: false
  });

  canvas.add(img);
  canvas.renderAll();

  setTimeout(() => {
    img.set('visible', true);
    img.animate(
      { blurValue: 0 },
      {
        duration,
        onChange: () => {
          filter.blur = img.blurValue;
          img.applyFilters();

          canvas.renderAll();
        },
        onComplete: () => {
          element.set({ visible: true });
          canvas.remove(img);

          setTimeout(() => {
            element.set({
              hasControls: true,
              hasBorders: true
            });
            canvas.renderAll();
          }, 200);
        }
      }
    );
  }, DELAY_DURATION);
};

export const animateIn = {
  fade,
  fadeScale,
  fadeSlide,
  slide,
  blur
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
  element.set({ hasControls: false, hasBorders: false });

  canvas.renderAll();

  setTimeout(() => {
    element.animate(animateProps, {
      duration,
      onChange: canvas.renderAll.bind(canvas),
      onComplete: () => {
        element.set(revertedProps);

        if (element.objectType === OBJECT_TYPE.TEXT && animateProps.opacity) {
          applyTextBoxProperties(element, { opacity: animateProps.opacity });
        }

        setTimeout(() => {
          element.set({
            hasControls: true,
            hasBorders: true
          });
          canvas.renderAll();
        }, 200);
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
const calcSlidePosition = (element, direction, canvas) => {
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
      startPos,
      startPosForFade: oriLeft * 0.8
    };
  }
  if (direction === ANIMATION_DIR.RIGHT_LEFT) {
    const canvasWidth = canvas.getWidth() / canvas.getZoom();
    const startPos = Math.abs(left - oriLeft) + canvasWidth;

    return {
      ...horizontalAnimation,
      startPos,
      startPosForFade: oriLeft * 1.2
    };
  }
  if (direction === ANIMATION_DIR.TOP_BOTTOM) {
    const startPos = -1 * Math.abs(top + height - oriTop);

    return {
      ...verticalAnimation,
      startPos,
      startPosForFade: oriTop * 0.8
    };
  }
  if (direction === ANIMATION_DIR.BOTTOM_TOP) {
    const canvasHeight = canvas.getHeight() / canvas.getZoom();
    const startPos = Math.abs(top - oriTop) + canvasHeight;

    return {
      ...verticalAnimation,
      startPos,
      startPosForFade: oriTop * 1.2
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
