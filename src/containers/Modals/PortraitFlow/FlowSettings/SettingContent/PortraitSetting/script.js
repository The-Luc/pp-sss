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
  computed: {
    isSingleFolder() {
      return this.flowSettings.folders.length === 1;
    },
    layout() {
      return {
        col: this.flowSettings.layoutSettings.colCount,
        row: this.flowSettings.layoutSettings.rowCount
      };
    }
  },
  methods: {
    /**
     * Go fire when users change layout setings
     * @param {Object} val config of layout settings
     */
    onLayoutChange(val) {
      this.$emit('portraitSettingChange', { layoutSettings: val });
    },

    /**
     * Go fire when users change teacher setings
     * @param {Object} val config of teacher settings
     */
    onTeacherSettingsChange(val) {
      this.$emit('portraitSettingChange', { teacherSettings: val });
    }
  }
};
