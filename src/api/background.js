import { getSuccessWithData, getErrorWithMessages } from '@/common/models';

import { isEmpty } from '@/common/utils';

import { BACKGROUND_PAGE_TYPE } from '@/common/constants';

import {
  BACKGROUNDS,
  BACKGROUND_CATEGORIES,
  getBackgroundOfFrame,
  getBackgroundOfPage
} from '@/mock/backgrounds';

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
  },
  /**
   * Get background of pages
   *
   * @param   {Array} pageNos list of page number
   * @returns {Array}         list of background url
   */
  getPageBackgrounds: pageNos => {
    const backgrounds = {};

    pageNos.forEach(p => (backgrounds[p] = getBackgroundOfPage(p)));

    return backgrounds;
  },
  /**
   * Get background of page
   *
   * @param   {Number} pageNo page number
   * @returns {String}        background url
   */
  getPageBackground: pageNo => {
    return getBackgroundOfPage(pageNo);
  },
  /**
   * Get background of frames
   *
   * @param   {Array} frameNos  list of frame number
   * @returns {Array}           list of background url
   */
  getFrameBackgrounds: frameNos => {
    const backgrounds = {};

    frameNos.forEach(f => (backgrounds[f] = getBackgroundOfFrame(f)));

    return backgrounds;
  },
  /**
   * Get background of frame
   *
   * @param   {Number} frameNo  frame number
   * @returns {String}          background url
   */
  getFrameBackground: frameNo => {
    return getBackgroundOfFrame(frameNo);
  }
};

export default backgroundService;
