export default {
  props: {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    isFirstLastDisplay: {
      type: Boolean,
      default: true
    },
    isUnderPortrait: {
      type: Boolean,
      default: true
    },
    cssStyle: {
      type: Object,
      default: () => ({})
    }
  }
};
