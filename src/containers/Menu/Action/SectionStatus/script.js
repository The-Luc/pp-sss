import { PROCESS_STATUS_OPTIONS } from '@/common/constants';

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    statusX: {
      type: Number
    },
    statusY: {
      type: Number
    },
    statusWidth: {
      type: Number
    },
    status: {
      type: Number
    }
  },
  data() {
    return { statusList: PROCESS_STATUS_OPTIONS };
  },
  methods: {
    /**
     * Fire when user click to select a status
     *
     * @param {Number}  status  selected status
     */
    onSelected(status) {
      this.$emit('change', { status });
    },
    /**
     * Fire when user click outside of status modal
     */
    onClickOutside() {
      this.$emit('clickOutside');
    }
  }
};
