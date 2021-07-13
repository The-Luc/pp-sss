import { mapActions, mapGetters, mapMutations } from 'vuex';

import { MODAL_TYPES } from '@/common/constants';
import Modal from '@/containers/Modal';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { ACTIONS as DIGITAL_ACTIONS } from '@/store/modules/digital/const';
import PpButton from '@/components/Buttons/Button';
import { useFrame, useFrameReplace } from '@/hooks';
export default {
  setup() {
    const { handleReplaceFrame } = useFrameReplace();
    const { currentFrameId } = useFrame();
    return { handleReplaceFrame, currentFrameId };
  },
  components: {
    Modal,
    PpButton
  },
  data() {
    return {
      isOpen: false
    };
  },
  computed: {
    ...mapGetters({
      modalData: GETTERS.MODAL_DATA
    })
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
    ...mapActions({
      updateSheeThemeLayout: DIGITAL_ACTIONS.UPDATE_SHEET_THEME_LAYOUT
    }),

    onAction() {
      const { sheetData } = this.modalData?.props;

      if (sheetData.addNewFrame) {
        const frame = sheetData.layout?.frames[0] || [];

        this.handleReplaceFrame({ frame, frameId: this.currentFrameId });
        this.onCancel();
        return;
      }
      sheetData && this.updateSheeThemeLayout(sheetData);
      this.onCancel();
    },

    /**
     * Close modal when click Cancel
     */
    onCancel() {
      this.toggleModal({
        isOpenModal: false,
        modalData: {
          type: MODAL_TYPES.OVERRIDE_LAYOUT
        }
      });
    }
  }
};
