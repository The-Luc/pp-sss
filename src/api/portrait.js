import moment from 'moment';

import { portraitFolders as mockPortraitFolders } from '@/mock/portraitFolders';

export const getPortraitFolders = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const { selectedPortraitFolders } = window.data.book;
      const portraitFolders = mockPortraitFolders.map(item => {
        if (!selectedPortraitFolders.includes(item.id)) return item;
        return {
          ...item,
          isSelected: true
        };
      });
      resolve(portraitFolders);
    });
  });
};

export const saveSelectedPortraitFolders = folderIds => {
  setTimeout(() => {
    const { selectedPortraitFolders } = window.data.book;
    window.data.book.selectedPortraitFolders = [
      ...new Set(selectedPortraitFolders.concat(folderIds))
    ];
  });
};

const portraitSevice = {
  /**
   * Save portrait settings
   * @param   {Object}  portraitSettings  portrait settings for save
   */
  savePortraitSettingsPrint: async portraitSettings => {
    try {
      const saveSettingsJson = await portraitSevice.getSavedPortraitSettingsPrint();

      const saveSettings = {
        ...portraitSettings,
        id: Date.now(),
        savedDate: moment(new Date()).format('ll')
      };

      saveSettingsJson.unshift(saveSettings);

      window.data.printSavedSettings = saveSettingsJson;

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
  getSavedPortraitSettingsPrint: async () => {
    try {
      const savedSettings = window.data.printSavedSettings;
      const savedSettingsJson = savedSettings || [];
      return Promise.resolve(savedSettingsJson);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Save portrait settings
   * @param   {Object}  portraitSettings  portrait settings for save
   */
  savePortraitSettingsDigital: async portraitSettings => {
    try {
      const saveSettingsJson = await portraitSevice.getSavedPortraitSettingsDigital();

      const saveSettings = {
        ...portraitSettings,
        id: Date.now(),
        savedDate: moment(new Date()).format('ll')
      };

      saveSettingsJson.unshift(saveSettings);

      window.data.digitalSavedSettings = saveSettingsJson;
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
  getSavedPortraitSettingsDigital: async () => {
    try {
      const savedSettings = window.data.digitalSavedSettings;
      const savedSettingsJson = savedSettings || [];
      return Promise.resolve(savedSettingsJson);
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

export default portraitSevice;
