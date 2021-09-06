import Layouts from '@/containers/ToolPopoverManager/Layouts/DigitalLayouts';
import { mapMutations } from 'vuex';
import { MUTATES } from '@/store/modules/theme/const';
import { EDITION } from '@/common/constants';
import { useFrame, useFrameAdd, useFrameReplace, useModal } from '@/hooks';

// for digital. After implement saving feature, this code can be remove
import { DIGITAL_LAYOUT_TYPES as LAYOUT_TYPES } from '@/mock/layoutTypes';
import { useObject } from '../composables';

export default {
  components: {
    Layouts
  },
  setup() {
    const { toggleModal, modalData } = useModal();
    const { handleAddFrame } = useFrameAdd();
    const { handleReplaceFrame } = useFrameReplace();
    const { setSupplementalLayoutId } = useFrame();
    const { updateObjectsToStore } = useObject();
    return {
      toggleModal,
      modalData,
      handleAddFrame,
      handleReplaceFrame,
      setSupplementalLayoutId,
      updateObjectsToStore
    };
  },
  data() {
    return {
      edition: EDITION.DIGITAL,
      initialData: {},
      supplementalLayoutData: {},
      right: 0
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

      this.handleAddFrame(frames);

      this.setSupplementalLayoutId({ id: layout.id });
      this.onClose();
    }
  },
  async created() {
    this.initialData = {
      layoutSelected: LAYOUT_TYPES.SUPPLEMENTAL_LAYOUTS,
      isSupplemental: true,
      isAddFrame: true
    };
  },
  mounted() {
    const styleRef = this.$el.style;
    const { width } = this.$el.getBoundingClientRect();
    const centerX = this.modalData?.props?.centerX;
    const left = centerX - width / 2;
    const right = centerX + width / 2;
    if (right > window.innerWidth) {
      styleRef.right = 0;
      this.right = `${window.innerWidth - centerX}px`;
    } else {
      styleRef.left = `${left}px`;
      this.right = '50%';
    }
  }
};
