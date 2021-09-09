import { CLASS_ROLE } from '@/common/constants';
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
    },
    numOfTeachers() {
      return this.flowSettings.folders[0].assets.reduce((acc, p) => {
        const isTeacher = p.classRole === CLASS_ROLE.PRIMARY_TEACHER;
        return isTeacher ? acc + 1 : acc;
      }, 0);
    },
    numOfAsstTeachers() {
      return this.flowSettings.folders[0].assets.reduce((acc, p) => {
        const isAsstTeacher = p.classRole === CLASS_ROLE.ASSISTANT_TEACHER;
        return isAsstTeacher ? acc + 1 : acc;
      }, 0);
    },
    isPageTitleOn() {
      return this.flowSettings.textSettings.isPageTitleOn;
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
