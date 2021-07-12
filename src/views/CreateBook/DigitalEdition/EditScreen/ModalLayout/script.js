import Layouts from '@/containers/ToolPopoverManager/PrintEdition/Layouts';
import { mapMutations } from 'vuex';
import { MUTATES } from '@/store/modules/theme/const';
import { EDITION, LAYOUT_TYPES } from '@/common/constants';
import { useFrame, useFrameAdd, useFrameReplace, useModal } from '@/hooks';

export default {
  components: {
    Layouts
  },
  setup() {
    const { toggleModal, modalData } = useModal();
    const { handleAddFrame } = useFrameAdd();
    const { handleReplaceFrame } = useFrameReplace();
    const { setSupplementalLayoutId } = useFrame();
    return {
      toggleModal,
      modalData,
      handleAddFrame,
      handleReplaceFrame,
      setSupplementalLayoutId
    };
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
    },

    /**
     * Trigger when add new frame
     * @param {Object} layout seleted supplemtal layout
     */
    onAddFrame(layout) {
      const frames = layout?.frames || [];

      const frameId = this.modalData?.props?.layoutId;

      // if layoutId existed: user is replacing layout
      if (frameId) {
        this.handleReplaceFrame({ frame: frames[0], frameId });
      } else {
        this.handleAddFrame(frames);
      }

      this.setSupplementalLayoutId({ id: layout.id });
      this.onClose();
    }
  },
  async created() {
    this.initialData = {
      layoutSelected: LAYOUT_TYPES.SUPPLEMENTAL_LAYOUTS,
      isSupplemental: true,
      isAddNew: !!this.modalData?.props?.isAddNew
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
