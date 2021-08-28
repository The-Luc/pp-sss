import CommonModal from '../CommonModal';
import TabHeader from './TabHeader';

export default {
  components: {
    CommonModal,
    TabHeader
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    selectedFolders: {
      type: Array,
      default: () => []
    },
    container: {
      type: String
    }
  },
  data() {
    return {
      currentTab: null
    };
  },
  methods: {
    /**
     * Emit cancel event to parent
     */
    onCancel() {
      this.$emit('cancel');
    },
    /**
     * Emit accept event to parent
     */
    onAccept() {
      this.$emit('accept');
    },
    /**
     * Emit accept event to parent
     */
    onSaveSettings() {
      this.$emit('saveSetting');
    }
  }
};
