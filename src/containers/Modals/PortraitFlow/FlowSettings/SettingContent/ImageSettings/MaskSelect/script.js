import { ICON_LOCAL } from '@/common/constants';

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    selectedVal: {
      type: Object,
      default: () => ({ name: '', value: '' })
    },
    appendedIcon: {
      type: String,
      default: ICON_LOCAL.ARROW_SELECT
    }
  },
  methods: {
    /**
     * Get option select after change and emit
     * @param  {Object} option selected option
     */
    onChange(option) {
      this.$emit('change', option);
    },
    /**
     * Check active option
     * @param {Number} val option value
     * @returns {Boolean} selected option
     */
    isActive(val) {
      return this.selectedVal.value === val;
    }
  }
};
