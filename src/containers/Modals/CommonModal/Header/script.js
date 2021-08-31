export default {
  props: {
    title: {
      type: String
    },
    isCloseIconDisplayed: {
      type: Boolean
    },
    isThemeUsed: {
      type: Boolean
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
