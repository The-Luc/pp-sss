import { isEmpty } from '@/common/utils';

class UniqueId {
  static cachePrefix = {};
  static cacheValue = 0;

  static generateId = prefix => {
    if (isEmpty(prefix)) {
      UniqueId.cacheValue++;

      return UniqueId.cacheValue;
    }

    if (isEmpty(UniqueId.cachePrefix[prefix])) UniqueId.cachePrefix[prefix] = 0;

    UniqueId.cachePrefix[prefix]++;

    return `${prefix}${UniqueId.cachePrefix[prefix]}`;
  };
}

export default UniqueId;
