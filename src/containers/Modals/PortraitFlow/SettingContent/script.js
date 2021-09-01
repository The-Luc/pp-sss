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
    }
  }
};
