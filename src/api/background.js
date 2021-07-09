import { getSuccessWithData, getErrorWithMessages } from '@/common/models';

import { isEmpty } from '@/common/utils';

import { BACKGROUNDS, BACKGROUND_CATEGORIES } from '@/mock/backgrounds';

const backgroundService = {
  /**
   * Get default theme id book
   *
   * @returns {Array}  query result
   */
  getBackgrounds: (
    backgroundTypeId,
    backgroundTypeSubId,
    backgroundPageTypeId
  ) => {
    return new Promise(resolve => {
      const data = BACKGROUNDS.filter(b => {
        const { backgroundType, categoryId, pageType } = b;

        if (backgroundType !== backgroundTypeId) return false;

        if (categoryId !== backgroundTypeSubId) return false;

        return pageType === backgroundPageTypeId;
      });

      const result = isEmpty(data)
        ? getErrorWithMessages([])
        : getSuccessWithData(data);

      resolve(result);
    });
  },
  /**
   * Get background categories
   *
   * @returns {Array}  query result
   */
  getCategories: () => {
    return new Promise(resolve => {
      const data = BACKGROUND_CATEGORIES;

      const result = isEmpty(data)
        ? getErrorWithMessages([])
        : getSuccessWithData(data);

      resolve(result);
    });
  }
};

export default backgroundService;
