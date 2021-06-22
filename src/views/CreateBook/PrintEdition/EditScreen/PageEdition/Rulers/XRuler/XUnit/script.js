export default {
  props: {
    number: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    hideNumber: {
      type: Boolean,
      default: false
    },
    isEnd: {
      type: Boolean,
      default: false
    },
    leftBorder: {
      type: Boolean,
      default: false
    },
    rightBorder: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    style() {
      return {
        width: this.width + 'px',
        borderLeftWidth: this.leftBorder ? '1px' : 0,
        borderRightWidth: this.rightBorder ? '1px' : 0
      };
    }
  }
};
