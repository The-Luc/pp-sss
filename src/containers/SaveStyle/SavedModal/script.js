import { EVENT_TYPE } from '@/common/constants';
import Modal from '@/containers/Modal';
import { useModal } from '@/hooks';

export default {
  setup() {
    const { modalData } = useModal();
    return { modalData };
  },
  components: {
    Modal
  },
  mounted() {
    this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
      styleId: this.modalData?.props?.value
    });
    setTimeout(() => {
      this.$root.$emit(EVENT_TYPE.SAVE_STYLE);
    }, 3000);
  }
};
