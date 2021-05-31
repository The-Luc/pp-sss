import { mapMutations, mapGetters } from 'vuex';

import Modal from '@/components/Modal';
import { useDrawLayout } from '@/hooks';
import { GETTERS, MUTATES } from '@/store/modules/book/const';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';

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
      pageSelected: GETTERS.GET_PAGE_SELECTED,
      sheetLayout: GETTERS.SHEET_LAYOUT
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
    layoutId() {
      return this.$attrs.props.layoutId;
    }
  },
  methods: {
    ...mapMutations({
      updateSheetThemeLayout: MUTATES.UPDATE_SHEET_THEME_LAYOUT,
      toggleModal: APP_MUTATES.TOGGLE_MODAL
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
        layoutId: this.layoutId,
        pagePosition
      });
    },
    /**
     * Get sheet's layout and draw
     */
    drawLayoutSinglePage() {
      const sheetLayout = this.sheetLayout(this.pageSelected);
      const { imageUrlLeft, imageUrlRight } = sheetLayout;
      this.drawLayout(imageUrlLeft, imageUrlRight);
    },
    /**
     * Update layout to sheet, draw layout and then close modal
     * @param  {String} pagePosition Left or right layout
     */
    onUpdateLayoutSheet(pagePosition) {
      this.updateSheet(pagePosition);
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
