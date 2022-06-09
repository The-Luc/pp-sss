import { getMappingColor, isEmpty } from '@/common/utils';
import Color from 'color';

class UniqueColor {
  static cacheImageColor = [];
  static cacheTextColor = [];

  static generateColor(index, isImage, alpha) {
    const cache = isImage ? this.cacheImageColor : this.cacheTextColor;

    if (isEmpty(cache[index])) {
      cache[index] = getMappingColor(isImage);
    }

    const color = cache[index];
    return alpha
      ? Color(color)
          .alpha(alpha)
          .toString()
      : color;
  }
}

export default UniqueColor;
