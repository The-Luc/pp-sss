export default {
  props: {
    theme: {
      type: Object,
      default: {}
    },
    selectedThemeId: {
      type: String,
      default: null
    }
  },
  methods: {
    onClick() {
      this.$emit('click', this.theme);
    }
  }
};
