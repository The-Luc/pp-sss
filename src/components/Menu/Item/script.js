import { ICON_LOCAL } from '@/common/constants';

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  created() {
    this.arrowDown = ICON_LOCAL.ARROW_DOWN;
  },
  methods: {
    onItemClick(event) {
      this.$emit('onItemClick', event);
    }
  }
};
