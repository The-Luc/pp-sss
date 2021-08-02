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
      statusCssClass: ''
    };
  },
  watch: {
    status(val) {
      if (val === SAVE_STATUS.START) this.statusCssClass = 'start-saving';
      if (val === SAVE_STATUS.END) {
        this.statusCssClass = 'end-saving';

        setTimeout(() => {
          this.statusCssClass = '';
        }, 1500);
      }
    }
  }
};
