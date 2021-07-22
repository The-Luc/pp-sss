import Modal from '@/containers/Modal';
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
  computed: {},
  methods: {
    /**
     * Trigger mutation to close modal
     */
    onCancel() {
      this.toggleModal({
        isOpenModal: false
      });
    }
  }
};
