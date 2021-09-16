import TextSetting from './TextSetting';
import PortraitSetting from './PortraitSetting';
import FlowSettings from './FlowSettings';
import SaveSetting from './SaveSetting';
import ImageSettings from './ImageSettings';

export default {
  components: {
    TextSetting,
    PortraitSetting,
    FlowSettings,
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
    }
  },
  methods: {
    onSettingChange(val) {
      this.$emit('settingChange', val);
    },
    onFlowSettingChange(val) {
      this.$emit('flowSettingChange', val);
    },
    onPageSettingChange(val) {
      this.$emit('pageSettingChange', val);
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
