import TextSetting from './TextSetting';
import PortraitSetting from './PortraitSetting';
import PrintFlowSettings from './FlowSettings/PrintFlowSettings';
import DigitalFlowSettings from './FlowSettings/DigitalFlowSettings';
import SaveSetting from './SaveSetting';
import ImageSettings from './ImageSettings';

export default {
  components: {
    TextSetting,
    PortraitSetting,
    PrintFlowSettings,
    DigitalFlowSettings,
    SaveSetting,
    ImageSettings
  },
  props: {
    currentTab: {
      type: Number,
      default: 0
    },
    flowSettings: {
      type: Object,
      default: () => ({})
    },
    selectedFolders: {
      type: Array,
      default: () => []
    },
    savedSettings: {
      type: Array,
      default: () => []
    },
    isDigital: {
      type: Boolean,
      default: false
    }
  },
  methods: {
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
