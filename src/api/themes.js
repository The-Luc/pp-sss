import { getSuccessWithData, getErrorWithMessages } from '@/common/models';

import { isEmpty } from '@/common/utils';

import { themeOptions } from '@/mock/themes';
import { themeOptions as digitalThemeOptions } from '@/mock/digitalThemes';

export const loadPrintThemes = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(themeOptions);
    });
  });

export const loadDigitalThemes = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(digitalThemeOptions);
    });
  });

const themeService = {
  /**
   * Get background themes for print edition
   *
   * @returns {Object}  query result
   */
  getPrintThemes: () => {
    return new Promise(resolve => {
      const data = themeOptions;

      const result = isEmpty(data)
        ? getErrorWithMessages([])
        : getSuccessWithData(data);

      resolve(result);
    });
  },
  /**
   * Get background themes for digital edition
   *
   * @returns {Object}  query result
   */
  getDigitalThemes: () => {
    return new Promise(resolve => {
      const data = digitalThemeOptions;

      const result = isEmpty(data)
        ? getErrorWithMessages([])
        : getSuccessWithData(data);

      resolve(result);
    });
  }
};

export default themeService;
