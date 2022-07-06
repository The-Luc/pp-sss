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
  useMappingSheet
} from '@/hooks';
import { updateSheetApi } from '@/api/sheet/api_mutation';

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

    return {
      toggleModal,
      getMappingConfig,
      updateMappingProject,
      currentSection,
      currentSheet,
      getSheetMappingConfig,
      updateSheetMappingConfig
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
    isCustomMapping() {
      const customMapping = 'Custom Mapping';
      return this.mappingType === customMapping ? true : false;
    }
  },
  async mounted() {
    await this.initData();
  },
  methods: {
    async onChangeMappingStatus(item) {
      const mappingStatus = item.value;
      await this.updateSheetMappingConfig(this.currentSheet.id, {
        mappingStatus
      });

      this.$root.$emit(EVENT_TYPE.APPLY_LAYOUT);
    },
    /**
     * To show the modal confirm reset content mapping
     */
    showConfirmReset() {
      if (this.isCustomMapping) return;
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
      const params = { typeMapping: MAPPING_TYPES.CUSTOM.value };
      await updateSheetApi(this.currentSheet.id, params);
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
