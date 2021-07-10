import { getSuccessWithData, getErrorWithMessages } from '@/common/models';

import { isEmpty } from '@/common/utils';

import { BACKGROUND_PAGE_TYPE } from '@/common/constants';

import { BACKGROUNDS, BACKGROUND_CATEGORIES } from '@/mock/backgrounds';

const backgroundService = {
  /**
   * Get background for print edition
   *
   * @returns {Object}  query result
   */
  getPrintBackgrounds: (
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
   * Get background categories for print edition
   *
   * @returns {Object}  query result
   */
  getPrintCategories: () => {
    return new Promise(resolve => {
      const data = BACKGROUND_CATEGORIES;

      const result = isEmpty(data)
        ? getErrorWithMessages([])
        : getSuccessWithData(data);

      resolve(result);
    });
  },
  /**
   * Get background for digital edition
   *
   * @returns {Object}  query result
   */
  getDigitalBackgrounds: (backgroundTypeId, backgroundTypeSubId) => {
    return new Promise(resolve => {
      const data = BACKGROUNDS.filter(b => {
        const { backgroundType, categoryId, pageType } = b;

        if (backgroundType !== backgroundTypeId) return false;

        if (categoryId !== backgroundTypeSubId) return false;

        return pageType === BACKGROUND_PAGE_TYPE.FULL_PAGE.id;
      });

      const result = isEmpty(data)
        ? getErrorWithMessages([])
        : getSuccessWithData(data);

      resolve(result);
    });
  },
  /**
   * Get background categories for digital edition
   *
   * @returns {Object}  query result
   */
  getDigitalCategories: () => {
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
