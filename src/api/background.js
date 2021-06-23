import { getSuccessWithData, getErrorWithMessages } from '@/common/models';

import { isEmpty } from '@/common/utils';

import { BACKGROUNDS } from '@/mock/backgrounds';

const backgroundService = {
  /**
   * Get default theme id book
   *
   * @returns {Array}  query result
   */
  getBackgrounds: () => {
    return new Promise(resolve => {
      const data = BACKGROUNDS;

      const result = isEmpty(data)
        ? getErrorWithMessages([])
        : getSuccessWithData(data);

      resolve(result);
    });
  }
};

export default backgroundService;
