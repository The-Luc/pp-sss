import SelectLayouts from './SelectLayouts';
import MapElements from './MapElements';
import ConfirmAction from '@/containers/Modals/ConfirmAction';
import { useModal } from '@/hooks';

export default {
  components: { SelectLayouts, ConfirmAction, MapElements },
  setup() {
    const { toggleModal } = useModal();
    return { toggleModal };
  },
  data() {
    return {
      isConfirmCancelDisplay: false,
      isSelectingLayout: true,
      printLayout: {},
      digitalLayout: {}
    };
  },
  computed: {},
  methods: {
    handleSelectedLayouts({ printLayout, digitalLayout }) {
      this.printLayout = printLayout;
      this.digitalLayout = digitalLayout;
      this.isSelectingLayout = false;
    },
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
