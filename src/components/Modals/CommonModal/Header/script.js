export default {
  props: {
    title: {
      type: String
    },
    isThemeUsed: {
      type: Boolean
    },
    isCloseIconDisplayed: {
      type: Boolean
    },
    isBackIconDisplayed: {
      type: Boolean
    }
  },
  methods: {
    /**
     * Emit cancel event when click on exit button
     */
    onCancel() {
      this.$emit('cancel');
    },
    /**
     * Emit cancel event when click on exit button
     */
    onBack() {
      this.$emit('back');
    }
  }
};
