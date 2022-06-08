import Select from '@/components/Selectors/Select';
import Properties from '@/components/Properties/BoxProperties';

import {
  ICON_LOCAL,
  MODAL_TYPES,
  PRIMARY_FORMAT_TYPES,
  MAPPING_TYPES,
  LINK_STATUS
} from '@/common/constants';
import {
  useModal,
  useMappingProject,
  useGetterEditionSection,
  useSheet,
  useMappingSheet
} from '@/hooks';

export default {
  components: {
    Select,
    Properties
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
      mappingConfig: null
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
      if (this.isDigital) return 'Screen Title';

      const { leftTitle, rightTitle } = this.currentSheet.spreadInfo;

      if (!leftTitle && !rightTitle) return this.currentSection.name;

      if (this.currentSheet.link === LINK_STATUS.LINK) return leftTitle;

      return `${leftTitle} - ${rightTitle}`;
    }
  },
  async mounted() {
    const [projectConfig, sheetConfig] = await Promise.all([
      this.getMappingConfig(),
      this.getSheetMappingConfig(this.currentSheet.id)
    ]);

    this.mappingConfig = { ...projectConfig, ...sheetConfig };
  },
  methods: {
    async onChangeMappingStatus(item) {
      const mappingStatus = item.value;
      await this.updateSheetMappingConfig(this.currentSheet.id, {
        mappingStatus
      });
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
    }
  }
};