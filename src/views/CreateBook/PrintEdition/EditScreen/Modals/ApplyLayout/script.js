import SelectPage from './SelectPage';
import ConfirmApplyLayout from './ConfirmApplyLayout';
import ScaleFitOption from './ScaleFitOption';

import { useApplyPrintLayout, useModal, useSheet } from '@/hooks';
import {
  resetObjects,
  isEmpty,
  isHalfSheet,
  isSingleLayout
} from '@/common/utils';
import { changeObjectsCoords } from '@/common/utils/layout';

export default {
  setup() {
    const { applyPrintLayout } = useApplyPrintLayout();
    const { toggleModal } = useModal();
    const { sheetLayout, currentSheet } = useSheet();
    return {
      toggleModal,
      applyPrintLayout,
      isConfirmApplyShown: false,
      isSelectPageShown: false,
      isScaleFitShown: false,
      sheetLayout,
      currentSheet
    };
  },
  components: { SelectPage, ConfirmApplyLayout, ScaleFitOption },
  computed: {
    layout() {
      return this.$attrs.props.layout;
    },
    themeId() {
      return this.$attrs.props.themeId;
    },
    isSingleLayout() {
      return isSingleLayout(this.layout);
    },
    isHalfSheet() {
      return isHalfSheet(this.currentSheet);
    }
  },
  mounted() {
    // confirm reset layout if there are any backgrounds or objects on canvas
    if (!isEmpty(this.sheetLayout)) {
      this.showConfirmModal();
      return;
    }

    // is applying on spread and the layout is single
    if (!this.isHalfSheet && this.isSingleLayout) {
      this.onSelectPage();
      return;
    }

    this.onApplyLayout();
  },
  methods: {
    onSelectPage() {
      this.isSelectPageShown = true;
      this.isConfirmApplyShown = false;
      this.isScaleFitShown = false;
    },
    onScaleFitShown() {
      this.isScaleFitShown = true;
      this.isSelectPageShown = false;
      this.isConfirmApplyShown = false;
    },
    showConfirmModal() {
      this.isConfirmApplyShown = true;
      this.isSelectPageShown = false;
      this.isScaleFitShown = false;
    },
    onCancel() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    onConfirmApply() {
      if (!this.isHalfSheet && this.isSingleLayout) {
        this.onSelectPage();
        return;
      }

      this.onApplyLayout();
    },
    /**
     * Trigger when use apply single layout on a spread and choose either left or right page
     *
     * @param {String} pagePosition left or right : position wher single layout is applied
     */
    onApplyOfSelectPage(pagePosition) {
      this.layout.objects = changeObjectsCoords(
        this.layout.objects,
        pagePosition
      );

      this.onApplyLayout({ pagePosition });
    },
    /**
     * Save objects to store and draw on canvas
     */
    onApplyLayout(args) {
      this.applyPrintLayout({
        sheetId: this.pageSelected?.id,
        themeId: this.themeSelected?.id,
        layout: this.layout,
        ...args
      });

      resetObjects();

      this.$root.$emit('drawLayout');
      this.$root.$emit('pageNumber');
      this.onCancel();
    }
  }
};
