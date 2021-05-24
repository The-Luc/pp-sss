export default {
  props: {
    themes: {
      type: Array,
      require: true
    },
    selectedThemeId: {
      type: Number,
      require: true
    }
  },
  methods: {
    onSelectTheme(themeId) {
      this.$emit('onSelectTheme', { themeId });
    },
    onPreviewTheme(themeId) {
      this.$emit('onPreviewTheme', { themeId });
    }
  }
};
