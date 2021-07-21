import Modal from '@/containers/Modal';
import PpButton from '@/components/Buttons/Button';
import { MODAL_TYPES } from '@/common/constants';
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
    },
    /**
     * Select page of layout to save layout and open modal set name layout
     */
    onSelectPageOfLayout() {
      this.onCancel();
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.SAVE_LAYOUT
        }
      });
    }
  }
};
