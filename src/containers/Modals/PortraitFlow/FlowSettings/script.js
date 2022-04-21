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
    savedSettings: {
      type: Array,
      default: () => []
    },
    isDigital: {
      type: Boolean
    },
    triggerTab: {
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
    },
    triggerTab(oldval, newVal) {
      if (oldval !== newVal) {
        this.currentTab = 0;
      }
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
      this.$emit('startPageChange', { startNo: pageNo });
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
    /**
     * To emit data to parent components to handle config changed
     * @param {Object} val configuration changed
     */
    onFlowSettingChange(val) {
      this.$emit('flowSettingChange', val);
    },
    /**
     * To emit data to parent components to handle config changed
     * @param {Object} val configuration changed
     */
    onPageSettingChange(val) {
      this.$emit('pageSettingChange', val);
    },
    /**
     * To emit data to parent components to handle config changed
     * @param {Object} val configuration changed
     */
    onScreenSettingChange(val) {
      this.$emit('screenSettingChange', val);
    },
    /**
     * Emit event load setting to parent
     * @param {Number}  id id of portrait setting to load
     */
    onLoadSetting(id) {
      this.$emit('loadSetting', id);
    }
  }
};
