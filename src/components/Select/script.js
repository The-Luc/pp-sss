import { ICON_LOCAL } from '@/common/constants';

export default {
  data() {
    return {
      arrowSelect: ICON_LOCAL.ARROW_SELECT
    };
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    /**
     * Get option select and emit
     * @param  {Object} item item selected
     */
    onChange(item) {
      this.$emit('change', item);
    }
  }
};
