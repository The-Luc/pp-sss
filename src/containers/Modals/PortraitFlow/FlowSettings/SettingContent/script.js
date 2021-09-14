import TextSetting from './TextSetting';
import PortraitSetting from './PortraitSetting';
import FlowSettings from './FlowSettings';
import ImageSettings from './ImageSettings';

export default {
  components: {
    TextSetting,
    PortraitSetting,
    FlowSettings,
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
    }
  }
};
