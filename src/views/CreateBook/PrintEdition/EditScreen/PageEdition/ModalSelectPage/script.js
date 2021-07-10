import { mapMutations, mapGetters, mapActions } from 'vuex';

import Modal from '@/containers/Modal';
import { useDrawLayout } from '@/hooks';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import {
  GETTERS as PRINT_GETTERS,
  ACTIONS as PRINT_ACTIONS
} from '@/store/modules/print/const';
import { EDITION } from '@/common/constants';
import { resetObjects } from '@/common/utils';

export default {
  setup() {
    const { drawLayout } = useDrawLayout();
    return {
      drawLayout
    };
  },
  components: {
    Modal
  },
  computed: {
    ...mapGetters({
      pageSelected: PRINT_GETTERS.CURRENT_SHEET,
      sheetLayout: PRINT_GETTERS.SHEET_LAYOUT
    }),
    numberPageLeft() {
      return this.$attrs.props.numberPageLeft;
    },
    numberPageRight() {
      return this.$attrs.props.numberPageRight;
    },
    sheetId() {
      return this.$attrs.props.sheetId;
    },
    themeId() {
      return this.$attrs.props.themeId;
    },
    layout() {
      return this.$attrs.props.layout;
    }
  },
  methods: {
    ...mapMutations({
      toggleModal: APP_MUTATES.TOGGLE_MODAL
    }),
    ...mapActions({
      updateSheetThemeLayout: PRINT_ACTIONS.UPDATE_SHEET_THEME_LAYOUT
    }),
    /**
     * Trigger mutation to close modal
     */
    closeModal() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    /**
     * Trigger mutation to update single layout for sheet
     * @param  {String} pagePosition Left or right layout
     */
    updateSheet(pagePosition) {
      this.updateSheetThemeLayout({
        sheetId: this.sheetId,
        themeId: this.themeId,
        layout: this.layout,
        pagePosition
      });
    },
    /**
     * Get sheet's layout and draw
     */
    drawLayoutSinglePage() {
      this.drawLayout(this.sheetLayout, EDITION.PRINT);
    },
    /**
     * Update layout to sheet, draw layout and then close modal
     * @param  {String} pagePosition Left or right layout
     */
    onUpdateLayoutSheet(pagePosition) {
      this.updateSheet(pagePosition);
      resetObjects(window.printCanvas);
      this.drawLayoutSinglePage();
      this.closeModal();
    },
    /**
     * Draw left layout when user click button from modal
     */
    onLeftClick() {
      this.onUpdateLayoutSheet('left');
    },
    /**
     * Draw right layout when user click button from modal
     */
    onRightClick() {
      this.onUpdateLayoutSheet('right');
    }
  }
};
