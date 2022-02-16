import Modal from '@/containers/Modals/Modal';
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
    },
    sheetId() {
      return this.currentSheet?.id;
    },
    leftPageId() {
      return this.currentSheet?.pageIds[0];
    },
    rightPageId() {
      return this.currentSheet?.pageIds[1];
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
     * @param  {String} id id of selected page (sheet, left page or right page)
     */
    onSelectPageOfLayout(id, type) {
      this.onCancel();
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.SAVE_LAYOUT,
          props: {
            id,
            type
          }
        }
      });
    },
    /**
     * Open modal set name layout of half sheet
     */
    onSaveLayoutOfHalfSheet() {
      if (SHEET_TYPE.FRONT_COVER === this.currentSheet.type) {
        this.onSelectPageOfLayout(this.rightPageId, 'PAGE');
        return;
      }
      if (SHEET_TYPE.BACK_COVER === this.currentSheet.type) {
        this.onSelectPageOfLayout(this.leftPageId, 'PAGE');
      }
    }
  }
};
