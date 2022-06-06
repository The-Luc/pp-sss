import { getMappingColor, isEmpty } from '@/common/utils';

class UniqueColor {
  static cacheImageColor = [];
  static cacheTextColor = [];

  static generateColor(index, isImage, alpha) {
    const cache = isImage ? this.cacheImageColor : this.cacheTextColor;

    if (isEmpty(cache[index])) {
      cache[index] = getMappingColor(isImage, alpha);
    }

    return cache[index];
  }
}

export default UniqueColor;
