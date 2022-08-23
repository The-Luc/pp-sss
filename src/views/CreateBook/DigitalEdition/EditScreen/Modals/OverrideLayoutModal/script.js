import { cloneDeep } from 'lodash';
import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';
import OptionApplyMapLayout from '@/containers/Modals/ApplyMapLayout';
import ConfirmAction from '@/containers/Modals/ConfirmAction';

import {
  useAnimation,
  useApplyDigitalLayout,
  useLayoutAddingSupport,
  useFrame,
  useFrameReplace,
  useModal,
  useMappingSheet
} from '@/hooks';
import { useObject } from '../../composables';
import { EVENT_TYPE } from '@/common/constants';
import { isLayoutMappingChecker } from '@/common/utils';
import { fetchSheetThumbnailsApi } from '@/api/sheet';

export default {
  setup() {
    const { handleReplaceFrame } = useFrameReplace();
    const { currentFrameId, setSupplementalLayoutId } = useFrame();
    const { toggleModal, modalData } = useModal();
    const { updateObjectsToStore } = useObject();
    const { updatePlayInIds, updatePlayOutIds } = useAnimation();
    const { applyDigitalLayout } = useApplyDigitalLayout();
    const { getLayoutFrames } = useLayoutAddingSupport();
    const {
      getSheetMappingConfig,
      removeElementMapingOfFrames,
      updateSheetMappingConfig
    } = useMappingSheet();

    return {
      handleReplaceFrame,
      currentFrameId,
      setSupplementalLayoutId,
      modalData,
      toggleModal,
      updateObjectsToStore,
      updatePlayInIds,
      updatePlayOutIds,
      applyDigitalLayout,
      getLayoutFrames,
      getSheetMappingConfig,
      removeElementMapingOfFrames,
      updateSheetMappingConfig,
      sheetMappingConfig: {},
      isShowCustomConfirm: false,
      isShowNonMapLayoutConfirm: false,
      isShowMapLayoutConfirm: false,
      isShowMapLayoutOption: false,
      imgUrls: [],
      isApplyBothEditor: false,
      isApplyPrimaryOnly: false,
      isApplyNonMapLayout: false
    };
  },
  components: {
    Modal,
    PpButton,
    OptionApplyMapLayout,
    ConfirmAction
  },
  computed: {
    sheetData() {
      const { sheetData } = this.modalData?.props;
      return sheetData;
    },
    layout() {
      return this.sheetData?.layout || {};
    },
    sheetId() {
      return this.sheetData?.sheetId;
    },
    isSuplemental() {
      return this.sheetData?.isReplaceFrame;
    }
  },
  async mounted() {
    if (this.isSuplemental) {
      this.isShowCustomConfirm = true;
      return;
    }

    this.sheetMappingConfig = await this.getSheetMappingConfig(this.sheetId);
    this.imgUrls = await this.getImageSrc();

    const isLayoutMapping = isLayoutMappingChecker(this.sheetMappingConfig);

    if (isLayoutMapping) {
      if (this.layout.mappings) {
        // if user applies mapped layout
        this.isShowMapLayoutConfirm = true;
      } else {
        // if user applies non-mapped layout
        this.isShowNonMapLayoutConfirm = true;
      }
    }
  },
  methods: {
    async applyLayout() {
      const layout = cloneDeep(this.layout);
      if (this.isApplyPrimaryOnly) layout.mappings = undefined;

      const frames = await this.applyDigitalLayout(layout);

      if (this.isApplyPrimaryOnly || this.isApplyNonMapLayout) {
        const frameIds = frames.map(f => f.id);

        await Promise.all([
          this.removeElementMapingOfFrames(this.sheetId, frameIds),
          this.updateSheetMappingConfig(this.sheetId, {
            mappingStatus: false
          })
        ]);
      }

      this.$root.$emit(EVENT_TYPE.APPLY_LAYOUT);
      this.onCloseModal();
    },
    async onAcceptCustomConfirm() {
      if (this.isSuplemental) {
        const layout = await this.getLayoutFrames(this.layout.id);
        const frame = layout?.frames[0] || [];

        this.updateObjectsToStore({ objects: frame.objects });
        this.updatePlayInIds({ playInIds: frame.playInIds });
        this.updatePlayOutIds({ playOutIds: frame.playOutIds });
        this.handleReplaceFrame({ frame, frameId: this.currentFrameId });

        this.setSupplementalLayoutId({ id: this.layout.id });
        this.onCloseCustomConfirm();
        return;
      }

      if (this.sheetData) {
        await this.applyLayout();
      }

      this.onCloseModal();
    },

    onAcceptNonMapLayout() {
      this.isShowNonMapLayoutConfirm = false;
      this.isApplyNonMapLayout = true;
      this.applyLayout();
    },

    onAcceptMapLayoutConfirm() {
      this.isShowMapLayoutConfirm = false;
      this.isShowMapLayoutOption = true;
    },
    /**
     * Trigger when user hit only apply on primary edition on option apply lyout modal
     */
    onApplyPrimaryOnly() {
      this.isShowMapLayoutOption = false;
      this.isApplyPrimaryOnly = true;
      this.applyLayout();
    },
    /**
     * Trigger when user hit apply both edition on option apply lyout modal
     */
    onApplyBoth() {
      this.isShowMapLayoutOption = false;
      this.isApplyBothEditor = true;
      this.applyLayout();
    },

    /**
     * Close modal when click Cancel
     */
    onCloseModal() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    /**
     * Trigger when user hit close on custom confirm modal
     */
    onCloseCustomConfirm() {
      this.isShowCustomConfirm = false;
      this.onCloseModal();
    },
    /**
     * Trigger when user hit close on non-mapped layout on LAYOUT MAPPING SHEET
     */
    onCloseNonMapLayout() {
      this.isShowNonMapLayoutConfirm = false;
      this.onCloseModal();
    },
    /**
     * Trigger when user hit close on map layout confirm modal
     */
    onCloseMapLayoutConfirm() {
      this.isShowMapLayoutConfirm = false;
      this.onCloseModal();
    },
    /**
     * Trigger when user hit close on option apply layout modal
     */
    onCloseMapLayout() {
      this.isShowMapLayoutOption = false;
      this.onCloseModal();
    },
    /**
     * To preview image for spread
     */
    async getImageSrc() {
      const urls = await fetchSheetThumbnailsApi(this.sheetId);
      return Object.values(urls).filter(Boolean);
    }
  }
};
