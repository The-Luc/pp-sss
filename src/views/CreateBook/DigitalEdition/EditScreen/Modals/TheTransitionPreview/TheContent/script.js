export default {
  props: {
    transitionType: {
      type: [Number, String],
      required: true
    },
    componentKey: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    maskUrl: {
      type: String
    },
    transitionCss: {
      type: String,
      required: true
    },
    isGroup: {
      type: Boolean,
      default: false
    }
  }
};
