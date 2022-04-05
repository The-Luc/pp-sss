import SelectLayouts from './SelectLayouts';
import ConfirmAction from '@/containers/Modals/ConfirmAction';
import { useModal } from '@/hooks';

export default {
  components: { SelectLayouts, ConfirmAction },
  setup() {
    const { toggleModal } = useModal();
    return { toggleModal };
  },
  data() {
    return {
      isConfirmCancelDisplay: false
    };
  },
  computed: {},
  methods: {
    /**
     * Trigger when user click agree to cancel
     */
    onCancel() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    showConfirmCancel() {
      this.isConfirmCancelDisplay = true;
    },
    onCloseConfirmCancel() {
      this.isConfirmCancelDisplay = false;
    }
  }
};
