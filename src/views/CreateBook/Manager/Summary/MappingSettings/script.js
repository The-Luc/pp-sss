import Section from '../SummaryInfo/SummarySection';
import PpSelect from '@/components/Selectors/Select';
import { PRIMARY_FORMAT_TYPES, MODAL_TYPES } from '@/common/constants';
import { useModal, useMappingProject, useBook } from '@/hooks';

export default {
  components: {
    Section,
    PpSelect
  },
  setup() {
    const { toggleModal } = useModal();
    const { getMappingConfig, updateMappingProject } = useMappingProject();
    const { bookId } = useBook();

    return { toggleModal, getMappingConfig, updateMappingProject, bookId };
  },
  data() {
    const primaryTypes = Object.values(PRIMARY_FORMAT_TYPES);
    const mappingFuncTypes = [
      { name: 'On', value: true },
      { name: 'Off', value: false }
    ];

    return {
      primaryTypes,
      mappingFuncTypes,
      mappingConfig: {}
    };
  },
  computed: {
    selectedPrimaryType() {
      const type = this.primaryTypes?.find(
        m => m.value === this.mappingConfig.primaryMapping
      );
      return type || this.primaryTypes[0];
    },
    selectedMappingFuncType() {
      const index = this.mappingConfig?.enableContentMapping ? 0 : 1;
      return this.mappingFuncTypes[index];
    }
  },
  watch: {
    async bookId(val) {
      if (!val) return;
      this.updateConfig();
    }
  },
  mounted() {
    this.updateConfig();
  },
  methods: {
    onChangePrimaryFormat(item) {
      const config = { primaryMapping: item.value };
      this.updateMappingProject(this.bookId, config);
    },
    onChangeMappingFunc(item) {
      const config = { enableContentMapping: item.value };
      this.updateMappingProject(this.bookId, config);
    },
    async updateConfig() {
      if (!this.bookId) return;

      this.mappingConfig = await this.getMappingConfig(this.bookId);
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
