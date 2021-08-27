export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    isCloseIconDisplayed: {
      type: Boolean,
      default: true
    },
    isThemeUsed: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * Emit cancel event when click on exit button
     */
    onCancel() {
      this.$emit('click');
    }
  }
};
