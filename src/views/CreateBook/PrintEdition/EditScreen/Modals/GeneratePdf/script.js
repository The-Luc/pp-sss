import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';
import { useModal, useAppCommon } from '@/hooks';
import { TIME_PER_PAGE } from '@/common/constants';

export default {
  setup() {
    const { toggleModal } = useModal();
    const { generalInfo } = useAppCommon();
    return { toggleModal, generalInfo };
  },
  data() {
    return {
      duration: 0
    };
  },
  components: {
    Modal,
    PpButton
  },
  mounted() {
    this.duration = TIME_PER_PAGE * this.generalInfo.totalPages;
  },
  methods: {
    onClose() {
      this.toggleModal({
        isOpenModal: false
      });
    }
  }
};
