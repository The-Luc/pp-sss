import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';

import {
  useAnimation,
  useApplyDigitalLayout,
  useFrame,
  useFrameReplace,
  useModal
} from '@/hooks';
import { useObject } from '../../composables';

export default {
  setup() {
    const { handleReplaceFrame } = useFrameReplace();
    const { currentFrameId, setSupplementalLayoutId } = useFrame();
    const { toggleModal, modalData } = useModal();
    const { updateObjectsToStore } = useObject();
    const { updatePlayInIds, updatePlayOutIds } = useAnimation();
    const { applyDigitalLayout } = useApplyDigitalLayout();

    return {
      handleReplaceFrame,
      currentFrameId,
      setSupplementalLayoutId,
      modalData,
      toggleModal,
      updateObjectsToStore,
      updatePlayInIds,
      updatePlayOutIds,
      applyDigitalLayout
    };
  },
  components: {
    Modal,
    PpButton
  },
  methods: {
    onAction() {
      const { sheetData } = this.modalData?.props;

      if (sheetData.isReplaceFrame) {
        const frame = sheetData.layout?.frames[0] || [];

        this.updateObjectsToStore({ objects: frame.objects });
        this.updatePlayInIds({ playInIds: frame.playInIds });
        this.updatePlayOutIds({ playOutIds: frame.playOutIds });
        this.handleReplaceFrame({ frame, frameId: this.currentFrameId });

        this.setSupplementalLayoutId({ id: sheetData.layout.id });
        this.onCancel();
        return;
      }

      sheetData && this.applyDigitalLayout(sheetData.layout);
      this.onCancel();
    },

    /**
     * Close modal when click Cancel
     */
    onCancel() {
      this.toggleModal({
        isOpenModal: false
      });
    }
  }
};
