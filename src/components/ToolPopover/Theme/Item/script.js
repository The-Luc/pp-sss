export default {
  props: {
    theme: {
      type: Object,
      default: {}
    },
    selectedThemeId: {
      type: Number,
      default: null
    }
  },
  methods: {
    onClick() {
      this.$emit('click', this.theme);
    }
  }
};
