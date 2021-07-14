import { mapMutations, mapActions } from 'vuex';

import Modal from '@/containers/Modal';
import PpButton from '@/components/Buttons/Button';
import { useDrawLayout, useSheet } from '@/hooks';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { ACTIONS as PRINT_ACTIONS } from '@/store/modules/print/const';
import { LAYOUT_TYPES, MODAL_TYPES, SHEET_TYPE } from '@/common/constants';
import { resetObjects } from '@/common/utils';

export default {
  components: {
    Modal,
    PpButton
  },
  setup() {
    const { drawLayout } = useDrawLayout();
    const { sheetLayout } = useSheet();
    return {
      drawLayout,
      sheetLayout
    };
  },
  computed: {
    pageSelected() {
      return this.$attrs.props.pageSelected;
    },
    sheetId() {
      return this.$attrs.props.sheetId;
    },
    themeId() {
      return this.$attrs.props.themeId;
    },
    layout() {
      return this.$attrs.props.layout;
    },
    layoutObjSelected() {
      return this.$attrs.props.layoutObjSelected;
    }
  },
  methods: {
    ...mapMutations({
      toggleModal: APP_MUTATES.TOGGLE_MODAL
    }),
    ...mapActions({
      updateSheetThemeLayout: PRINT_ACTIONS.UPDATE_SHEET_THEME_LAYOUT
    }),
    onApplyLayout() {
      if (
        this.layoutObjSelected.type === LAYOUT_TYPES.SINGLE_PAGE.value &&
        ![SHEET_TYPE.FRONT_COVER, SHEET_TYPE.BACK_COVER].includes(
          this.pageSelected?.type
        )
      ) {
        this.onCancel();
        this.toggleModal({
          isOpenModal: true,
          modalData: {
            type: MODAL_TYPES.SELECT_PAGE,
            props: {
              numberPageLeft: this.pageSelected?.pageLeftName,
              numberPageRight: this.pageSelected?.pageRightName,
              sheetId: this.pageSelected?.id,
              themeId: this.themeSelected?.id,
              layout: this.layoutObjSelected
            }
          }
        });
        return;
      }
      this.updateSheetThemeLayout({
        sheetId: this.pageSelected?.id,
        themeId: this.themeSelected?.id,
        layout: this.layoutObjSelected
      });
      resetObjects(window.printCanvas);
      this.drawLayout(this.sheetLayout);
      this.$root.$emit('pageNumber');
      this.onCancel();
    },
    onCancel() {
      this.toggleModal({
        isOpenModal: false
      });
    }
  }
};
