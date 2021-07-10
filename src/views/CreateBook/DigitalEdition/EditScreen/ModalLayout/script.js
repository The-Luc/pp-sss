import Layouts from '@/containers/ToolPopoverManager/PrintEdition/Layouts';
import { mapMutations } from 'vuex';
import { MUTATES } from '@/store/modules/theme/const';
import { EDITION, LAYOUT_TYPES } from '@/common/constants';
import { useModal } from '@/hooks';

export default {
  components: {
    Layouts
  },
  setup() {
    const { toggleModal, modalData } = useModal();
    return { toggleModal, modalData };
  },
  data() {
    return {
      edition: EDITION.DIGITAL,
      initialData: {},
      supplementalLayoutData: {}
    };
  },
  methods: {
    ...mapMutations({
      setDigitalLayouts: MUTATES.DIGITAL_LAYOUTS
    }),

    /**
     * Trigger mutation update state to close modal
     */
    onClose() {
      this.toggleModal({ isOpenModal: false });
    }
  },
  async created() {
    this.initialData = {
      layoutSelected: LAYOUT_TYPES.SUPLEMENTAL_LAYOUTS,
      isSupplemental: true
    };
  },
  mounted() {
    const styleRef = this.$el.style;
    const { width, right } = this.$el.getBoundingClientRect();
    const centerX = this.modalData?.props?.centerX;
    const left = centerX - width / 2;
    if (right > window.innerWidth) {
      styleRef.right = 0;
    } else {
      styleRef.left = `${left}px`;
    }
  }
};
