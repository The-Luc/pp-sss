export default {
  props: {
    name: {
      type: String
    },
    isNameDisplayed: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
