import TextSetting from './TextSetting';
import PortraitSetting from './PortraitSetting';

export default {
  components: {
    TextSetting,
    PortraitSetting
  },
  props: {
    currentTab: {
      type: Number,
      default: 0
    },
    flowSettings: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    onSettingChange(val) {
      this.$emit('settingChange', val);
    }
  }
};
