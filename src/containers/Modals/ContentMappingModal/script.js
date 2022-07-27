import ConfirmAction from '@/containers/Modals/ConfirmAction';
import { MODAL_TYPES } from '@/common/constants';
import { useModal } from '@/hooks';

export default {
  components: {
    ConfirmAction
  },
  setup() {
    const { toggleModal } = useModal();

    return { toggleModal };
  },
  methods: {
    onLearnMore() {
      this.onContinue();
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.CONTENT_MAPPING_OVERVIEW
        }
      });
    },
    onContinue() {
      this.toggleModal({
        isOpenModal: false
      });
    }
  }
};
