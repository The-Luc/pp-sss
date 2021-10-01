import { isEmpty } from '../utils';

export const calcFrameAnimationDuration = (objects, orders, animationType) => {
  return isEmpty(orders)
    ? 0
    : orders.reduce(
        (acc, order) =>
          acc +
          Math.max(
            0,
            ...order.map(id => {
              const animation = objects[id][animationType];
              return animation?.style ? animation.duration : 0;
            })
          ),
        0
      );
};
