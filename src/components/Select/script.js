import { ICON_LOCAL } from '@/common/constants';

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    prependedIcon: {
      type: String,
      default: ''
    },
    appendedIcon: {
      type: String,
      default: ICON_LOCAL.ARROW_SELECT
    }
  },
  methods: {
    /**
     * Get option select after change and emit
     * @param  {Object} option option selected
     */
    onChange(option) {
      this.$emit('change', option);
    }
  }
};
