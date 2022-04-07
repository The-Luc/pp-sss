import SelectLayouts from './SelectLayouts';
import MapElements from './MapElements';
import ConfirmAction from '@/containers/Modals/ConfirmAction';
import { useModal, useLayoutElements } from '@/hooks';

export default {
  components: { SelectLayouts, ConfirmAction, MapElements },
  setup() {
    const { toggleModal } = useModal();
    const { getLayoutElements } = useLayoutElements();
    return { toggleModal, getLayoutElements };
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
    async handleSelectedLayouts({ printLayout, digitalLayout }) {
      const printObjects = await this.getLayoutElements(printLayout.id);

      this.printLayout = printLayout;
      this.printLayout.objects = printObjects;
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
