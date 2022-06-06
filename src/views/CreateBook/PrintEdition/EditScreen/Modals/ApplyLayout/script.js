import SelectPage from './SelectPage';
import ConfirmApplyLayout from './ConfirmApplyLayout';
import ScaleFitOption from './ScaleFitOption';

import { useApplyPrintLayout, useModal, useSheet } from '@/hooks';
import {
  resetObjects,
  isEmpty,
  isHalfSheet,
  isSingleLayout,
  isCoverSheetChecker
} from '@/common/utils';
import {
  changeObjectsCoords,
  isCoverLayoutChecker
} from '@/common/utils/layout';

export default {
  setup() {
    const { applyPrintLayout } = useApplyPrintLayout();
    const { toggleModal } = useModal();
    const { sheetLayout, currentSheet } = useSheet();
    return {
      toggleModal,
      applyPrintLayout,
      sheetLayout,
      currentSheet,
      isConfirmApplyShown: false,
      isSelectPageShown: false,
      isScaleFitShown: false,
      pagePosition: null
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
    },
    isCoverSheet() {
      return isCoverSheetChecker(this.currentSheet);
    }
  },
  mounted() {
    const isConfirm = this.showConfirmModal();
    if (isConfirm) return;

    const isSelect = this.showSelectPage();
    if (isSelect) return;

    const isScaleFit = this.showScaleFitOption();
    if (isScaleFit) return;

    this.onApplyLayout();
  },
  methods: {
    showConfirmModal() {
      if (!isEmpty(this.sheetLayout)) {
        this.isConfirmApplyShown = true;
        return true;
      }
    },
    /**
     * Trigger when use agree apply layout on comfirmation modal
     */
    onConfirmApply() {
      this.isConfirmApplyShown = false;
      const isSelect = this.showSelectPage();
      if (isSelect) return;

      const isScaleFit = this.showScaleFitOption();
      if (isScaleFit) return;

      this.onApplyLayout();
    },
    showSelectPage() {
      // is applying on spread and the layout is single
      if (this.isHalfSheet || !this.isSingleLayout) return false;

      this.isSelectPageShown = true;
      return true;
    },
    /**
     * Trigger when use apply single layout on a spread and choose either left or right page
     *
     * @param {String} pagePosition left or right : position wher single layout is applied
     */
    onApplyOfSelectPage(pagePosition) {
      this.pagePosition = pagePosition;
      this.isSelectPageShown = false;

      this.layout.objects = changeObjectsCoords(
        this.layout.objects,
        pagePosition
      );

      const isScaleFit = this.showScaleFitOption();
      if (isScaleFit) return;

      this.onApplyLayout({ pagePosition });
    },
    showScaleFitOption() {
      if (this.isCoverSheet && !isCoverLayoutChecker(this.layout)) {
        this.isScaleFitShown = true;
        return true;
      }
    },
    onScale() {
      this.isScaleFitShown = false;
      this.onApplyLayout({ isScale: true });
    },
    onFit() {
      this.isScaleFitShown = false;
      this.onApplyLayout({ isFit: true });
    },
    onCancel() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    /**
     * Save objects to store and draw on canvas
     */
    async onApplyLayout(args) {
      await this.applyPrintLayout({
        sheetId: this.pageSelected?.id,
        themeId: this.themeSelected?.id,
        layout: this.layout,
        pagePosition: this.pagePosition,
        ...args
      });

      resetObjects();

      this.$root.$emit('drawLayout');
      this.$root.$emit('pageNumber');
      this.onCancel();
    }
  }
};
