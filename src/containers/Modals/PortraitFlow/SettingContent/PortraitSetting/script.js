import LayoutSetting from './LayoutSetting';
import TeacherSetting from './TeacherSetting';

export default {
  components: {
    LayoutSetting,
    TeacherSetting
  },
  props: {
    flowSettings: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    onLayoutChange(val) {
      this.$emit('portraitSettingChange', { layoutSettings: val });
    }
  }
};
