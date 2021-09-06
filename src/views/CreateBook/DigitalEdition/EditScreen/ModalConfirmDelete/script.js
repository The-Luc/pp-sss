import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';
import {
  useDigitalSheetAction,
  useFrame,
  useFrameDelete,
  useModal,
  useSheet
} from '@/hooks';

export default {
  setup() {
    const { handleDeleteFrame } = useFrameDelete();
    const { currentFrameId } = useFrame();
    const { modalData, toggleModal } = useModal();
    const { removeTransition } = useDigitalSheetAction();
    const { currentSheet } = useSheet();

    return {
      handleDeleteFrame,
      currentFrameId,
      toggleModal,
      modalData,
      removeTransition,
      currentSheet
    };
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

      this.removeTransition(this.currentSheet.id);

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
