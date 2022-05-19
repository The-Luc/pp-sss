import Section from '../SummaryInfo/SummarySection';
import PpSelect from '@/components/Selectors/Select';
import { PRIMARY_FORMAT_TYPES, MODAL_TYPES } from '@/common/constants';
import { useModal } from '@/hooks';

export default {
  components: {
    Section,
    PpSelect
  },
  setup() {
    const { toggleModal } = useModal();

    return { toggleModal };
  },
  data() {
    const primaryTypes = Object.values(PRIMARY_FORMAT_TYPES);
    const mappingFuncTypes = [
      { name: 'On', value: true },
      { name: 'Off', value: false }
    ];

    return {
      primaryTypes,
      mappingFuncTypes
    };
  },
  computed: {
    selectedPrimaryType() {
      return this.primaryTypes[0];
    },
    selectedMappingFuncType() {
      return this.mappingFuncTypes[0];
    }
  },
  methods: {
    onChangePrimaryFormat(item) {
      console.log(item);
    },
    onChangeMappingFunc(item) {
      console.log(item);
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
