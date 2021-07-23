export default {
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    isEnable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    disabledCssClass() {
      return this.isEnable ? '' : 'disabled';
    }
  }
};
