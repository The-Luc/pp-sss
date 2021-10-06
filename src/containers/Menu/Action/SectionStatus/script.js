import { PROCESS_STATUS } from '@/common/constants';

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
    const statusList = Object.values(PROCESS_STATUS).map(v => v);

    return { statusList };
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
