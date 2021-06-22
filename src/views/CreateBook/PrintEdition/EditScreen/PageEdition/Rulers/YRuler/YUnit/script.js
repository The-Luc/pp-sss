export default {
  props: {
    number: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    topBorder: {
      type: Boolean,
      default: false
    },
    bottomBorder: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    style() {
      return {
        height: this.height + 'px',
        borderTopWidth: this.topBorder ? '1px' : 0,
        borderBottomWidth: this.bottomBorder ? '1px' : 0
      };
    }
  }
};
