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
    },
    previewPortraitsRange: {
      type: Array,
      required: true
    },
    isDigital: {
      type: Boolean
    }
  },
  data() {
    return {
      currentTab: null,
      displayedPageNo: this.flowSettings?.startOnPageNumber
    };
  },
  watch: {
    'flowSettings.startOnPageNumber'(value) {
      this.displayedPageNo = value;
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
