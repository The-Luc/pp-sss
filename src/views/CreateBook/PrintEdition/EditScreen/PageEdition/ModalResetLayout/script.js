import { mapMutations } from 'vuex';

import Modal from '@/containers/Modal';
import PpButton from '@/components/Buttons/Button';
import { useDrawLayout, useGetLayouts, useSheet } from '@/hooks';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import {
  EDITION,
  MODAL_TYPES,
  SHEET_TYPE,
  LAYOUT_PAGE_TYPE
} from '@/common/constants';
import { pxToIn, resetObjects } from '@/common/utils';

export default {
  components: {
    Modal,
    PpButton
  },
  setup() {
    const { drawLayout } = useDrawLayout();
    const { sheetLayout } = useSheet();
    const { updateSheetThemeLayout } = useGetLayouts(EDITION.PRINT);
    return {
      drawLayout,
      sheetLayout,
      updateSheetThemeLayout
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
    onApplyLayout() {
      if (
        this.layoutObjSelected.pageType === LAYOUT_PAGE_TYPE.SINGLE_PAGE.id &&
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
      const zoom = window.printCanvas.getZoom();
      const width = window.printCanvas.width;
      const positionCenterX = pxToIn(width / zoom / 2);
      this.updateSheetThemeLayout({
        sheetId: this.pageSelected?.id,
        themeId: this.themeSelected?.id,
        layout: this.layoutObjSelected,
        positionCenterX
      });
      resetObjects(window.printCanvas);
      this.$root.$emit('drawLayout');
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
