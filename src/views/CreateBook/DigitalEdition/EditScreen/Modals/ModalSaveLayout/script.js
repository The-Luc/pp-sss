import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';
import NameSavedLayout from './NameSavedLayout';
import ChooseFrames from './ChooseFrames';

import { EVENT_TYPE } from '@/common/constants';
import { useModal, useSheet, useFrame } from '@/hooks';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    Modal,
    PpButton,
    NameSavedLayout,
    ChooseFrames
  },
  setup() {
    const { toggleModal } = useModal();
    const { currentSheet } = useSheet();
    const { currentFrameId, frames } = useFrame();

    return {
      toggleModal,
      currentSheet,
      currentFrameId,
      frames,
      isChooseType: true,
      isNameLayout: false,
      isChooseFrames: false,
      selectedFrames: [],
      isSupplemental: false
    };
  },
  computed: {
    sheetId() {
      return this.currentSheet?.id;
    },
    frameIds() {
      if (isEmpty(this.frames)) return [];
      return this.frames.map(f => f.id);
    }
  },
  watch: {
    isChooseType(val) {
      if (!val) return;

      this.isNameLayout = false;
      this.isChooseFrames = false;
    },
    isNameLayout(val) {
      if (!val) return;

      this.isChooseType = false;
      this.isChooseFrames = false;
    },
    isChooseFrames(val) {
      if (!val) return;

      this.isChooseType = false;
      this.isNameLayout = false;
    }
  },
  mounted() {
    this.isChooseType = true;
  },
  methods: {
    /**
     * Trigger mutation to close modal
     */
    onCancel() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    /**
     * Save selected frame
     */
    onSelectedFrame() {
      this.isNameLayout = true;
      this.isSupplemental = true;
      this.selectedFrames = [this.currentFrameId];
    },
    onSelectMultiFrames(val) {
      this.selectedFrames = val;
      this.isNameLayout = true;
      this.isSupplemental = false;
    },
    onChooseFrames() {
      this.isChooseFrames = true;
    },
    saveLayout(layoutName) {
      this.$root.$emit(EVENT_TYPE.SAVE_LAYOUT, {
        layoutName,
        ids: this.selectedFrames,
        isSupplemental: this.isSupplemental
      });
      this.onCancel();
    }
  }
};
