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
  useFrameAction
} from '@/hooks';

import { MUTATES as PRINT_MUTATES } from '@/store/modules/print/const';
import { MUTATES as DIGITAL_MUTATES } from '@/store/modules/digital/const';

import { updateSheetApi } from '@/api/sheet/api_mutation';
import { resetObjects } from '@/common/utils';
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
      updateSheetMappingConfig
    } = useMappingSheet();
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
      updateFramesAndThumbnails
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
      const customMapping = 'Custom Mapping';
      const statusOff = false;
      return this.mappingType === customMapping ||
        this.selectedStatus.value === statusOff
        ? true
        : false;
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
        DIGITAL_MUTATES.UPDATE_OBJECTS_AND_THUMBNAIL,
      deleteBackground: DIGITAL_MUTATES.DELETE_BACKGROUND
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
      const emptyArray = [];
      const params = { typeMapping: MAPPING_TYPES.CUSTOM.value };
      await updateSheetApi(this.currentSheet.id, params);

      if (this.isDigital) {
        const frames = await this.getSheetFrames(this.currentSheet.id);
        const willUpdateFrames = frames
          .filter(frame => frame.fromLayout)
          .map(frame => {
            this.clearDigitalObjectsAndThumbnail({
              frameId: frame.id,
              thumbnailUrl: '',
              objects: emptyArray,
              playInIds: emptyArray,
              playOutIds: emptyArray
            });
            return {
              ...frame,
              objects: [],
              playInIds: [],
              playOutIds: [],
              previewImageUrl: ''
            };
          });
        await this.updateFramesAndThumbnails(willUpdateFrames);

        this.clearDigitalObjects({ objectList: emptyArray });
        this.deleteBackground();

        resetObjects(this.digitalCanvas);
      } else {
        // delelte objects on DB
        await this.savePageData(this.currentSheet.id, emptyArray);
        // delete objects in Vuex
        this.clearPrintObjects({ objectList: emptyArray });
        // delete objects on canvas
        resetObjects(this.printCanvas);
      }

      await this.initData();
      this.onCloseConfirmReset();
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
