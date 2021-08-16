import Modal from '@/containers/Modal';
import PpButton from '@/components/Buttons/Button';
import { MODAL_TYPES, SHEET_TYPE } from '@/common/constants';
import { useModal, useSheet, useBackgroundGetter } from '@/hooks';
import { isFullBackground, isHalfSheet } from '@/common/utils';

export default {
  components: {
    Modal,
    PpButton
  },
  setup() {
    const { toggleModal } = useModal();
    const { currentSheet } = useSheet();
    const { backgrounds } = useBackgroundGetter();
    return { toggleModal, currentSheet, backgrounds };
  },
  computed: {
    isHalfSheet() {
      return isHalfSheet(this.currentSheet);
    },
    isContainFullBackground() {
      return isFullBackground(this.backgrounds.left);
    }
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
     * Select page of layout to save layout and open modal set name layout
     * @param  {String} pageSelected page left, right, full
     */
    onSelectPageOfLayout(pageSelected) {
      this.onCancel();
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.SAVE_LAYOUT,
          props: {
            pageSelected
          }
        }
      });
    },
    /**
     * Open modal set name layout of half sheet
     */
    onSaveLayoutOfHalfSheet() {
      if (SHEET_TYPE.FRONT_COVER === this.currentSheet.type) {
        this.onSelectPageOfLayout('right');
        return;
      }
      if (SHEET_TYPE.BACK_COVER === this.currentSheet.type) {
        this.onSelectPageOfLayout('left');
        return;
      }
    }
  }
};
