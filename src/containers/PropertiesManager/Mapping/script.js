import Select from '@/components/Selectors/Select';
import Properties from '@/components/Properties/BoxProperties';
import ConfirmAction from '@/containers/Modals/ConfirmAction';

import {
  ICON_LOCAL,
  MODAL_TYPES,
  PRIMARY_FORMAT_TYPES,
  MAPPING_TYPES,
  EVENT_TYPE
} from '@/common/constants';
import {
  useModal,
  useMappingProject,
  useGetterEditionSection,
  useSheet,
  useMappingSheet,
  useSavePageData,
  useFrameAction,
  useFrameOrdering
} from '@/hooks';

import { MUTATES as PRINT_MUTATES } from '@/store/modules/print/const';
import { MUTATES as DIGITAL_MUTATES } from '@/store/modules/digital/const';
import { updateSheetApi } from '@/api/sheet/api_mutation';
import { createFrameApi, updateFrameOrderApi } from '@/api/frame/api_mutation';
import {
  resetObjects,
  isHalfSheet,
  isHalfLeft,
  isHalfRight
} from '@/common/utils';
import { mapMutations } from 'vuex';

export default {
  components: {
    Select,
    Properties,
    ConfirmAction
  },
  props: {
    isDigital: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { toggleModal } = useModal();
    const { getMappingConfig, updateMappingProject } = useMappingProject();
    const { currentSection } = useGetterEditionSection();
    const { currentSheet } = useSheet();
    const {
      getSheetMappingConfig,
      updateSheetMappingConfig,
      deleteSheetMappings
    } = useMappingSheet();
    const { updateFrameOrder } = useFrameOrdering();
    const { savePageData } = useSavePageData();
    const { getSheetFrames, updateFramesAndThumbnails } = useFrameAction();
    return {
      toggleModal,
      getMappingConfig,
      updateMappingProject,
      currentSection,
      currentSheet,
      getSheetMappingConfig,
      updateSheetMappingConfig,
      savePageData,
      getSheetFrames,
      updateFramesAndThumbnails,
      deleteSheetMappings,
      updateFrameOrder
    };
  },
  data() {
    const statusOpts = [
      { name: 'On', value: true },
      { name: 'Off', value: false }
    ];
    return {
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      statusOpts,
      mappingConfig: null,
      isConfirmResetDisplay: false
    };
  },
  computed: {
    selectedStatus() {
      const index = this.mappingConfig?.mappingStatus ? 0 : 1;
      return this.statusOpts[index];
    },
    enableContentMapping() {
      return this.mappingConfig?.enableContentMapping;
    },
    primaryFormat() {
      return (
        PRIMARY_FORMAT_TYPES[this.mappingConfig?.primaryMapping]?.name || ''
      );
    },
    mappingType() {
      return MAPPING_TYPES[this.mappingConfig?.mappingType]?.name || '';
    },
    currentContainerTitle() {
      if (this.isDigital) return this.currentSection.name;

      const { pageLeftName, pageRightName } = this.currentSheet;

      return `${pageLeftName} - ${pageRightName}`;
    },
    isDisableReset() {
      const isCustomMapping = this.mappingType === MAPPING_TYPES.CUSTOM.name;
      return isCustomMapping || !this.selectedStatus.value;
    }
  },
  async mounted() {
    await this.initData();
  },
  methods: {
    ...mapMutations({
      clearPrintObjects: PRINT_MUTATES.SET_OBJECTS,
      clearDigitalObjects: DIGITAL_MUTATES.SET_OBJECTS,
      clearDigitalObjectsAndThumbnail:
        DIGITAL_MUTATES.DELETE_OBJECTS_AND_THUMBNAIL,
      deleteBackgroundDigital: DIGITAL_MUTATES.DELETE_BACKGROUND,
      deleteBackgroundPrint: PRINT_MUTATES.DELETE_BACKGROUND,
      setFrames: DIGITAL_MUTATES.SET_FRAMES
    }),
    async onChangeMappingStatus(item) {
      const mappingStatus = item.value;
      await this.updateSheetMappingConfig(this.currentSheet.id, {
        mappingStatus
      });

      this.$root.$emit(EVENT_TYPE.APPLY_LAYOUT);
      await this.initData();
    },
    /**
     * To show the modal confirm reset content mapping
     */
    showConfirmReset() {
      if (this.isDisableReset) return;
      this.toggleModal({
        isOpenModal: true
      });
      this.isConfirmResetDisplay = true;
    },
    onCloseConfirmReset() {
      this.isConfirmResetDisplay = false;
      this.toggleModal({
        isOpenModal: false
      });
    },
    async onReset() {
      const params = { mappingType: MAPPING_TYPES.CUSTOM.value };
      await updateSheetApi(this.currentSheet.id, params);

      this.resetDigitalEditor();
      this.resetPrintEditor();

      await this.deleteSheetMappings(this.currentSheet.id);

      await this.initData();

      this.$root.$emit(EVENT_TYPE.RESET_MAPPING_TYPE);
      this.onCloseConfirmReset();
    },

    async resetDigitalEditor() {
      const halfSheet = isHalfSheet(this.currentSheet);
      const numberOfOriginalFrame = halfSheet ? 2 : 4;

      const frames = await this.getSheetFrames(this.currentSheet.id);
      const supFrameIds = [];
      const oriFrameIds = [];
      const originalFrames = [];

      frames.forEach(f => {
        if (!f.fromLayout) {
          supFrameIds.push(parseInt(f.id));
          return;
        }
        oriFrameIds.push(parseInt(f.id));
        originalFrames.push(f);
      });

      const numOfFramesNeeded = numberOfOriginalFrame - originalFrames.length;

      if (numOfFramesNeeded > 0) {
        const framePromise = Array(numOfFramesNeeded)
          .fill(0)
          .map(() => {
            return createFrameApi(this.currentSheet.id, {
              previewImageUrl: '',
              objects: []
            });
          });

        const newFrames = await Promise.all(framePromise);
        newFrames.forEach(f => {
          oriFrameIds.push(parseInt(f.id));
          originalFrames.push(f);
        });
        oriFrameIds.sort();

        const frameOrderIds = [...oriFrameIds, ...supFrameIds];
        await updateFrameOrderApi(this.currentSheet.id, frameOrderIds);
        this.setFrames({ framesList: originalFrames });
      }
      this.clearDigitalObjectsAndThumbnail({ frameIds: oriFrameIds });

      const willUpdateFrames = frames
        .filter(frame => frame.fromLayout)
        .map(frame => {
          return {
            ...frame,
            objects: [],
            playInIds: [],
            playOutIds: [],
            previewImageUrl: ''
          };
        });
      await this.updateFramesAndThumbnails(willUpdateFrames);

      this.clearDigitalObjects({ objectList: [] });
      this.deleteBackgroundDigital();
      resetObjects(this.digitalCanvas);
    },

    async resetPrintEditor() {
      // delelte objects on DB
      await this.savePageData(this.currentSheet.id, []);
      // delete objects in Vuex
      this.clearPrintObjects({ objectList: [] });
      // delete objects on canvas
      if (isHalfRight(this.currentSheet)) {
        this.deleteBackgroundPrint({ isLeft: false });
      } else if (isHalfLeft(this.currentSheet)) {
        this.deleteBackgroundPrint({ isLeft: true });
      } else {
        this.deleteBackgroundPrint({ isLeft: true });
        this.deleteBackgroundPrint({ isLeft: false });
      }
      resetObjects(this.printCanvas);
    },

    /**
     * To show the content mapping overview modal
     */
    onClickHelp() {
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.CONTENT_MAPPING_OVERVIEW
        }
      });
    },
    /**
     * Trigger render component by changing component key
     */
    async initData() {
      const [projectConfig, sheetConfig] = await Promise.all([
        this.getMappingConfig(),
        this.getSheetMappingConfig(this.currentSheet.id)
      ]);

      this.mappingConfig = { ...projectConfig, ...sheetConfig };
    }
  }
};
