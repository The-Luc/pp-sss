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
      savedStyleJson.push(style);
      window.sessionStorage.setItem(
        'textStyle',
        JSON.stringify(savedStyleJson)
      );
      return Promise.resolve(savedStyleJson);
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
  }
};

export default styleService;
