export default {
  props: {
    themes: {
      type: Array,
      require: true
    },
    selectedThemeId: {
      type: [Number, String],
      require: true
    }
  },
  methods: {
    /**
     * Get theme's id selected and emit
     * @param  {Number} theme.themeId - Theme's id selected
     */
    onSelectTheme(themeId) {
      this.$emit('onSelectTheme', { themeId });
    },
    /**
     * Get theme's id preview and emit
     * @param  {Number} theme.themeId - Theme's id selected
     */
    onPreviewTheme(themeId) {
      this.$emit('onPreviewTheme', { themeId });
    }
  }
};
