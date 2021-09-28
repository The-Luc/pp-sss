import moment from 'moment';

export const getPortraitFolders = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(window.data.book.portraitFolders);
    });
  });
};

export const saveSelectedPortraitFolders = folderIds => {
  setTimeout(() => {
    const { portraitFolders } = window.data.book;
    window.data.book.portraitFolders = portraitFolders.map(item => {
      if (!folderIds.includes(item.id)) return item;
      return {
        ...item,
        isSelected: true
      };
    });
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
