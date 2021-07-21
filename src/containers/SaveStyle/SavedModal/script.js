import { EVENT_TYPE } from '@/common/constants';
import Modal from '@/containers/Modal';

export default {
  components: {
    Modal
  },
  mounted() {
    setTimeout(() => {
      this.$root.$emit(EVENT_TYPE.SAVE_STYLE);
    }, 3000);
  }
};
