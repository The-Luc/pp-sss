import TextSetting from './TextSetting';
import PortraitSetting from './PortraitSetting';
import FlowSettings from './FlowSettings';

export default {
  components: {
    TextSetting,
    PortraitSetting,
    FlowSettings
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
    }
  }
};
