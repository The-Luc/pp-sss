import { isEmpty } from '../utils';

export const calcFrameAnimationDuration = (
  background,
  objects,
  orders,
  animationType
) => {
  const bgAnimation = isEmpty(background.left)
    ? {}
    : background.left[animationType];

  const bgDuration = bgAnimation?.style ? bgAnimation.duration : 0;

  const objectsDuration = isEmpty(orders)
    ? 0
    : orders.reduce(
        (acc, order) =>
          acc +
          Math.max(
            ...order.map(id => {
              const animation = objects[id][animationType];
              return animation?.style ? animation.duration : 0;
            })
          ),
        0
      );

  return bgDuration + objectsDuration;
};
