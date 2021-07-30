import { SAVE_STATUS } from '@/common/constants';

export default {
  props: {
    message: {
      type: String,
      default: 'Saving...'
    },
    status: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      statusClass: ''
    };
  },
  watch: {
    status(val) {
      if (val === SAVE_STATUS.START) this.statusClass = 'start-saving';
      if (val === SAVE_STATUS.END) {
        this.statusClass = 'end-saving';

        setTimeout(() => {
          this.statusClass = '';
        }, 1500);
      }
    }
  }
};
