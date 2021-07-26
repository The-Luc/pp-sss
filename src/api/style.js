import {
  MAX_SAVED_IMAGE_STYLES,
  MAX_SAVED_TEXT_STYLES
} from '@/common/constants';

const styleService = {
  /**
   * Save text style
   *
   * @param   {Object}  style  text style for save
   * @returns {Array}   saved styles
   */
  saveTextStyle: async style => {
    try {
      const savedStyleJson = await styleService.getSavedTextStyles();
      const newSavedStyleJson = [
        ...savedStyleJson.slice(1 - MAX_SAVED_TEXT_STYLES),
        style
      ];
      window.sessionStorage.setItem(
        'textStyle',
        JSON.stringify(newSavedStyleJson)
      );
      return Promise.resolve(newSavedStyleJson);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Get list saved text style
   *
   * @returns {Array}   saved styles
   */
  getSavedTextStyles: async () => {
    try {
      const savedStyle = window.sessionStorage.getItem('textStyle');
      const savedStyleJson = savedStyle ? JSON.parse(savedStyle) : [];
      return Promise.resolve(savedStyleJson);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Save image style
   *
   * @param   {Object}  style  image style for save
   * @returns {Array}   saved styles
   */
  saveImageStyle: async style => {
    try {
      const savedStyleJson = await styleService.getSavedImageStyles();
      const newSavedStyleJson = [
        ...savedStyleJson.slice(1 - MAX_SAVED_IMAGE_STYLES),
        style
      ];
      window.sessionStorage.setItem(
        'imageStyle',
        JSON.stringify(newSavedStyleJson)
      );
      return Promise.resolve(newSavedStyleJson);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * Get list saved image style
   *
   * @returns {Array}   saved styles
   */
  getSavedImageStyles: async () => {
    try {
      const savedStyle = window.sessionStorage.getItem('imageStyle');
      const savedStyleJson = savedStyle ? JSON.parse(savedStyle) : [];
      return Promise.resolve(savedStyleJson);
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

export default styleService;
