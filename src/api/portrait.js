import moment from 'moment';

import { portraitFolders } from '@/mock/portraitFolders';
import { getUniqueId } from '@/common/utils';

export const getPortraitFolders = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(portraitFolders);
    });
  });
};

const printPortraitSevice = {
  /**
   * Save portrait settings
   * @param   {Object}  portraitSettings  portrait settings for save
   */
  savePortraitSettings: async portraitSettings => {
    try {
      const saveSettingsJson = await printPortraitSevice.getSavedPortraitSettings();
      delete portraitSettings.folders;

      const saveSettings = {
        id: getUniqueId(),
        ...portraitSettings,
        savedDate: moment(new Date()).format('ll')
      };

      saveSettingsJson.unshift(saveSettings);

      window.sessionStorage.setItem(
        'portraitSettings',
        JSON.stringify(saveSettingsJson)
      );
      return Promise.resolve({
        success: true
      });
    } catch (error) {
      return Promise.reject({
        success: false,
        error
      });
    }
  },

  /**
   * Get list saved portrait settings
   * @returns {Array}   saved portrait settings
   */
  getSavedPortraitSettings: async () => {
    try {
      const savedSettings = window.sessionStorage.getItem('portraitSettings');
      const savedSettingsJson = savedSettings ? JSON.parse(savedSettings) : [];
      return Promise.resolve(savedSettingsJson);
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

export default printPortraitSevice;
