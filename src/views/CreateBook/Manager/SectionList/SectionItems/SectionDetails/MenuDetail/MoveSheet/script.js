import ICON_LOCAL from '@/common/constants/icon';

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    isShow: {
      type: Boolean,
      default: false
    },
    sections: {
      type: Array
    }
  },
  methods: {
    onChangeStatus() {
      this.$emit('onChangeStatus');
    }
  },
  created() {
    this.arrowDown = ICON_LOCAL.ARROW_DOWN;
  }
};
