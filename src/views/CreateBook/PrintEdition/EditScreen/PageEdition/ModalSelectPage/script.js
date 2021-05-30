import { mapMutations } from 'vuex';

import Modal from '@/components/Modal';
import { useDrawLayout } from '@/hooks';
import { MUTATES } from '@/store/modules/book/const';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { LAYOUT_TYPES } from '@/common/constants';

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
    numberPageLeft() {
      return this.$attrs.props.numberPageLeft;
    },
    numberPageRight() {
      return this.$attrs.props.numberPageRight;
    },
    imageUrlLeft() {
      return this.$attrs.props.imageUrlLeft;
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
    closeModal() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    updateSheet(pagePosition) {
      this.updateSheetThemeLayout({
        sheetId: this.sheetId,
        themeId: this.themeId,
        layoutId: this.layoutId,
        pagePosition,
        layoutType: LAYOUT_TYPES.SINGLE_PAGE.value
      });
    },
    onLeftClick() {
      this.drawLayout(this.imageUrlLeft, '');
      this.updateSheet('left');
      this.closeModal();
    },
    onRightClick() {
      this.drawLayout('', this.imageUrlLeft);
      this.updateSheet('right');
      this.closeModal();
    }
  }
};
