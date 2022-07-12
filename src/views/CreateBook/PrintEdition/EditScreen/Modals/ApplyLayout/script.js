import { cloneDeep } from 'lodash';
import SelectPage from './SelectPage';
import ConfirmApplyLayout from './ConfirmApplyLayout';
import ConfirmAction from '@/containers/Modals/ConfirmAction';
import OptionApplyMapLayout from '@/containers/Modals/ApplyMapLayout';
import ScaleFitOption from './ScaleFitOption';

import {
  useApplyPrintLayout,
  useModal,
  useSheet,
  useMappingSheet,
  useFrameAction
} from '@/hooks';
import {
  resetObjects,
  isEmpty,
  isHalfSheet,
  isSingleLayout,
  isCoverSheetChecker,
  isLayoutMappingChecker
} from '@/common/utils';
import {
  changeObjectsCoords,
  isCoverLayoutChecker
} from '@/common/utils/layout';
import { EVENT_TYPE } from '@/common/constants';
import { fetchSheetThumbnailsApi } from '@/api/sheet';

export default {
  setup() {
    const { applyPrintLayout } = useApplyPrintLayout();
    const { toggleModal } = useModal();
    const { sheetLayout, currentSheet } = useSheet();
    const {
      getSheetMappingConfig,
      deleteSheetMappings,
      updateSheetMappingConfig
    } = useMappingSheet();
    const { getSheetFrames } = useFrameAction();
    return {
      toggleModal,
      applyPrintLayout,
      sheetLayout, // all objects + backgrounds of the current sheet
      sheetMappingConfig: {},
      currentSheet,
      getSheetMappingConfig,
      getSheetFrames,
      deleteSheetMappings,
      updateSheetMappingConfig,
      isConfirmApplyShown: false,
      isSelectPageShown: false,
      isScaleFitShown: false,
      pagePosition: null,
      isShowNonMapLayoutConfirm: false,
      isShowMapLayoutConfirm: false,
      isShowConfirmForLayoutMapping: false,
      isApplyBothEditor: false,
      isApplyPrimaryOnly: false,
      isApplyNonMapLayout: false,
      imgUrls: ''
    };
  },
  components: {
    SelectPage,
    ConfirmApplyLayout,
    ScaleFitOption,
    ConfirmAction,
    OptionApplyMapLayout
  },
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
  async mounted() {
    this.sheetMappingConfig = await this.getSheetMappingConfig(
      this.currentSheet.id
    );

    this.imgUrls = await this.getImageSrc();

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
      const isLayoutMapping = isLayoutMappingChecker(this.sheetMappingConfig);

      if (isLayoutMapping) {
        if (this.layout.mappings) {
          // if user applies mapped layout
          this.isShowConfirmForLayoutMapping = true;
        } else {
          // if user applies non-mapped layout
          this.isShowNonMapLayoutConfirm = true;
        }
        return true;
      }

      // if there are objects on the current sheet
      if (!isEmpty(this.sheetLayout)) {
        this.isConfirmApplyShown = true;
        return true;
      }
    },
    /**
     * Trigger when user agree apply layout on comfirmation modal
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
    /**
     * Close modal
     */
    onCancel() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    /**
     * Save objects to store and draw on canvas
     */
    async onApplyLayout(args) {
      const layout = cloneDeep(this.layout);

      if (this.isApplyPrimaryOnly || this.isApplyNonMapLayout) {
        layout.mappings = undefined;

        await Promise.all([
          this.deleteSheetMappings(this.currentSheet.id),
          this.updateSheetMappingConfig(this.currentSheet.id, {
            mappingStatus: false
          })
        ]);
      }

      await this.applyPrintLayout({
        layout: this.layout,
        pagePosition: this.pagePosition,
        ...args
      });

      resetObjects();

      this.$root.$emit(EVENT_TYPE.APPLY_LAYOUT);
      this.$root.$emit('pageNumber');
      this.onCancel();
    },
    /**
     * Trigger when user hit Cancel on Non-maped Layout Confirm modal
     */
    onCloseNonMapLayout() {
      this.isShowNonMapLayoutConfirm = false;
      this.onCancel();
    },
    /**
     * Trigger when user hit Cancel on Maped Layout Confirm modal
     */
    onCloseMapLayout() {
      this.isShowMapLayoutConfirm = false;
      this.onCancel();
    },
    /**
     * Trigger when user hit Cancel on the Confirm modal for apply on layout mapping sheet
     */
    onCloseConfirmForLayoutMapping() {
      this.isShowConfirmForLayoutMapping = false;
      this.onCancel();
    },
    /**
     * Trigger when user hit apply layout on non mapped layout confirm
     * - Apply layout on print
     * - Remove all connections
     */
    onAcceptNonMapLayout() {
      this.isApplyNonMapLayout = true;
      this.isShowNonMapLayoutConfirm = false;
      this.onConfirmApply();
    },
    /**
     * Trigger when user apply mapped layout only on primary editor
     */
    onApplyPrimaryOnly() {
      this.isApplyPrimaryOnly = true;
      this.isShowMapLayoutConfirm = false;
      this.onConfirmApply();
    },
    /**
     * Trigger when user apply mapped layout both print and digital
     */
    onApplyBoth() {
      this.isApplyBothEditor = true;
      this.isShowMapLayoutConfirm = false;
      this.onConfirmApply();
    },
    /**
     * Trigger when user apply a layout on layout mapping type sheet
     */
    onAcceptForLayoutMapping() {
      this.isShowConfirmForLayoutMapping = false;
      this.isShowMapLayoutConfirm = true;
    },
    /**
     * To preview image for spred or frame
     */
    async getImageSrc() {
      if (this.isDigital) {
        // get print thumbnail
        return fetchSheetThumbnailsApi(this.currentSheet.id);
      }

      // get frame thumbnails
      const frames = await this.getSheetFrames(this.currentSheet.id);

      return [frames[0].previewImageUrl];
    }
  }
};
