import Preview from './Preview';
import Settings from './Settings';
import SettingContent from './SettingContent';

export default {
  components: {
    Preview,
    Settings,
    SettingContent
  },
  props: {
    selectedFolders: {
      type: Array,
      default: () => []
    },
    flowSettings: {
      type: Object
    },
    requiredPages: {
      type: Array
    }
  },
  data() {
    return {
      currentTab: null
    };
  },
  computed: {
    displayedPageNo() {
      return this.flowSettings?.startOnPageNumber;
    }
  },
  methods: {
    /**
     * Save setting by emit to parent
     */
    onSaveSettings() {
      this.$emit('saveSettings');
    },
    /**
     * Fire when setting tab change
     *
     * @param {Number}  tabIndex  index of selected tab
     */
    onSettingTabChange({ tabIndex }) {
      this.currentTab = tabIndex;
    },
    /**
     * Set new start page
     *
     * @param {Number}  pageNo  selected page
     */
    onStartPageChange({ pageNo }) {
      this.$emit('startPageChange', { pageNo });
    },
    /**
     * Show preview by emit to parent
     */
    onShowPreview() {
      this.$emit('showPreview');
    },

    /**
     * To emit data to parent components to handle config changed
     * @param {Object} val configuration changed
     */
    onSettingChange(val) {
      this.$emit('settingChange', val);
    },
    onFlowSettingChange(val) {
      this.$emit('flowSettingChange', val);
    },
    onPageSettingChange(val) {
      this.$emit('pageSettingChange', val);
    }
  }
};
