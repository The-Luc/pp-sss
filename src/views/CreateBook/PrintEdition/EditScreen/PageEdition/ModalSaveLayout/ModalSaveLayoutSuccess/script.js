import Modal from '@/containers/Modal';
import { useModal } from '@/hooks';

export default {
  setup() {
    const { toggleModal } = useModal();
    return { toggleModal };
  },
  components: {
    Modal
  },
  created() {
    setTimeout(() => {
      this.toggleModal({
        isOpenModal: false
      });
    }, 1000);
  }
};
