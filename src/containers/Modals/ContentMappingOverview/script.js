import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';
import { useModal } from '@/hooks';

export default {
  components: {
    Modal,
    PpButton
  },
  setup() {
    const { toggleModal } = useModal();

    return { toggleModal };
  },
  methods: {
    /**
     * Trigger when use hit Got it button
     */
    onCancel() {
      this.toggleModal({
        isOpenModal: false
      });
    }
  }
};
