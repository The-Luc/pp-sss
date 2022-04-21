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
    },
    selectedFolders: {
      type: Array,
      required: true
    },
    isDigital: {
      type: Boolean
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
    selectedFolderAssets() {
      return this.selectedFolders[0].assets;
    },
    numOfAsstTeachers() {
      return this.selectedFolderAssets.filter(
        ({ classRole }) => classRole === CLASS_ROLE.ASSISTANT_TEACHER
      ).length;
    },
    numOfTeachers() {
      return this.selectedFolderAssets.filter(
        ({ classRole }) => classRole === CLASS_ROLE.PRIMARY_TEACHER
      ).length;
    },
    isPageTitleOn() {
      return this.flowSettings.textSettings.isPageTitleOn;
    }
  },
  methods: {
    /**
     * Get fired when users change layout setings
     * @param {Object} val config of layout settings
     */
    onLayoutChange(val) {
      this.$emit('portraitSettingChange', { layoutSettings: val });
    },

    /**
     * Get fired when users change teacher setings
     * @param {Object} val config of teacher settings
     */
    onTeacherSettingsChange(val) {
      this.$emit('portraitSettingChange', { teacherSettings: val });
    }
  }
};
