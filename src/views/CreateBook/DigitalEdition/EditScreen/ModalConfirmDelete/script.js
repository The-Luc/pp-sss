import Modal from '@/containers/Modal';
import PpButton from '@/components/Buttons/Button';
import { useFrame, useFrameDelete, useModal } from '@/hooks';

export default {
  setup() {
    const { handleDeleteFrame } = useFrameDelete();
    const { currentFrameId } = useFrame();
    const { modalData, toggleModal } = useModal();
    return { handleDeleteFrame, currentFrameId, toggleModal, modalData };
  },
  components: {
    Modal,
    PpButton
  },
  methods: {
    /**
     * Fire when use confrirm to delete a frame
     */
    onAction() {
      this.handleDeleteFrame(this.modalData.props.id);
      this.onCancel();
    },

    /**
     * Close modal when click Cancel
     */
    onCancel() {
      this.toggleModal({
        isOpenModal: false
      });
    }
  }
};
