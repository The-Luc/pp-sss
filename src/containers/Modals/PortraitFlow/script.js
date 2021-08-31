import CommonModal from '../CommonModal';
import Preview from './Preview';
import Settings from './Settings';
import SettingContent from './SettingContent';

export default {
  components: {
    CommonModal,
    Preview,
    Settings,
    SettingContent
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
    },
    /**
     * Fire when setting tab change
     *
     * @param {Number}  tabIndex  index of selected tab
     */
    onSettingTabChange(tabIndex) {
      this.currentTab = tabIndex;
    }
  }
};
