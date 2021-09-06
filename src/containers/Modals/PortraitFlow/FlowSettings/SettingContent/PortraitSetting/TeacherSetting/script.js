import PpCombobox from '@/components/Selectors/Combobox';
import {
  ASSISTANT_PLACEMENT_OPTIONS,
  ICON_LOCAL,
  PORTRAIT_ASSISTANT_PLACEMENT,
  PORTRAIT_SIZE,
  PORTRAIT_SIZE_OPTIONS,
  PORTRAIT_TEACHER_PLACEMENT,
  TEACHER_PLACEMENT_OPTIONS,
  YES_NO_OPTIONS
} from '@/common/constants';
import { getValueInput } from '@/common/utils';

export default {
  components: {
    PpCombobox
  },
  props: {
    teacherSettings: {
      type: Object,
      default: () => ({})
    },
    isSingleFolder: {
      type: Boolean
    },
    layout: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      teacherPlacementOptions: TEACHER_PLACEMENT_OPTIONS,
      assistantPlacementOptions: ASSISTANT_PLACEMENT_OPTIONS,
      portraitSizeOptions: PORTRAIT_SIZE_OPTIONS,
      yesNoOptions: YES_NO_OPTIONS,
      defaultHasTeacher: false,
      defaultHasAsstTeacher: false,
      defaultTeacherPlacement: PORTRAIT_TEACHER_PLACEMENT.FIRST,
      defaultAsstPlacement: PORTRAIT_ASSISTANT_PLACEMENT.AFTER_TEACHERS,
      defaultTeacherSize: PORTRAIT_SIZE.LARGE,
      defaultAsstSize: PORTRAIT_SIZE.SAME,
      dataUI: null,
      disabledOption: { name: '--', value: '--' }
    };
  },
  computed: {
    hasTeacher() {
      return this.getSelectedOption(
        this.teacherSettings.hasTeacher,
        this.yesNoOptions
      );
    },
    hasAssistantTeacher() {
      return this.getSelectedOption(
        this.teacherSettings.hasAssistantTeacher,
        this.yesNoOptions
      );
    },
    teacherPlacement() {
      if (!this.teacherSettings.hasTeacher) return this.disabledOption;

      return this.getSelectedOption(
        this.teacherSettings.teacherPlacement,
        this.teacherPlacementOptions
      );
    },
    teacherPortraitSize() {
      if (!this.teacherSettings.hasTeacher) return this.disabledOption;

      return this.getSelectedOption(
        this.teacherSettings.teacherPortraitSize,
        this.portraitSizeOptions
      );
    },
    asstTeacherPlacement() {
      if (!this.teacherSettings.hasAssistantTeacher) return this.disabledOption;

      return this.getSelectedOption(
        this.teacherSettings.assistantTeacherPlacement,
        this.assistantPlacementOptions
      );
    },
    asstTeacherPortraitSize() {
      if (!this.teacherSettings.hasAssistantTeacher) return this.disabledOption;

      return this.getSelectedOption(
        this.teacherSettings.assistantTeacherPortraitSize,
        this.portraitSizeOptions
      );
    },
    isDisabledHasTeacher() {
      if (!this.isSingleFolder) return true;

      return false;
    },
    isDisabledHasAsstTeacher() {
      if (!this.isSingleFolder || !this.teacherSettings.hasTeacher) return true;

      return false;
    },
    isDisabledTeacherPlacement() {
      if (!this.isSingleFolder || !this.teacherSettings.hasTeacher) return true;

      const isLessThanFour = this.layout.col < 4 && this.layout.row < 4;
      if (isLessThanFour) return true;

      return false;
    },
    isDisabledTeacherPortraitSize() {
      if (!this.isSingleFolder || !this.teacherSettings.hasTeacher) return true;

      return false;
    },
    isDisabledAsstPlacement() {
      if (!this.isSingleFolder || !this.teacherSettings.hasAssistantTeacher)
        return true;

      return false;
    },
    isDisabledAsstPortraitSize() {
      const isTeacherSizeSame =
        this.teacherSettings.teacherPortraitSize === PORTRAIT_SIZE.SAME;

      if (
        !this.isSingleFolder ||
        !this.teacherSettings.hasAssistantTeacher ||
        isTeacherSizeSame
      )
        return true;

      return false;
    }
  },
  created() {
    this.initData();
  },
  watch: {
    teacherSettings: {
      deep: true,
      handler() {
        this.initData();
      }
    },
    layout: {
      deep: true,
      handler() {
        this.initData();
      }
    }
  },
  methods: {
    /**
     * Fire when user change teacher combobox
     * @param {Object} val selected option from combobox
     */
    onChangeHasTeacher(val) {
      if (!getValueInput(val)) {
        this.handleChangeData({
          hasTeacher: false,
          hasAssistantTeacher: false,
          teacherPlacement: this.defaultTeacherPlacement,
          assistantTeacherPlacement: this.defaultAsstPlacement,
          teacherPortraitSize: this.defaultTeacherSize,
          assistantTeacherPortraitSize: this.defaultAsstSize
        });
        return;
      }

      this.handleChangeData({ hasTeacher: true });
    },
    /**
     * Fire when user change assistant teacher combobox
     * @param {Object} val selected option from combobox
     */
    onChangeHasAsstTeacher(val) {
      if (!getValueInput(val)) {
        this.handleChangeData({
          hasAssistantTeacher: false,
          assistantTeacherPlacement: this.defaultAsstPlacement,
          assistantTeacherPortraitSize: this.defaultAsstSize
        });
        return;
      }

      this.handleChangeData({ hasAssistantTeacher: true });
    },
    /**
     * Fire when user change teacher placement combobox
     * @param {Object} val selected option from combobox
     */
    onChangeTeacherPlacement(val) {
      this.handleChangeData({ teacherPlacement: getValueInput(val) });
    },
    /**
     * Fire when user change teacher size combobox
     * @param {Object} val selected option from combobox
     */
    onChangeTeacherSize(val) {
      const value = getValueInput(val);

      // If teacher portrait is SAME => asst portrait is also SAME
      if (value === PORTRAIT_SIZE.SAME) {
        this.handleChangeData({
          teacherPortraitSize: value,
          assistantTeacherPortraitSize: value
        });
        return;
      }
      this.handleChangeData({ teacherPortraitSize: value });
    },
    /**
     * Fire when user change assistant teacher placement combobox
     * @param {Object} val selected option from combobox
     */
    onChangeAsstPlacement(val) {
      this.handleChangeData({ assistantTeacherPlacement: getValueInput(val) });
    },
    /**
     * Fire when user change assistant teacher size combobox
     * @param {Object} val selected option from combobox
     */
    onChangeAsstSize(val) {
      this.handleChangeData({
        assistantTeacherPortraitSize: getValueInput(val)
      });
    },
    /**
     * to emit data to parent component
     * @param {Object} val fields will be updated centered data
     */
    handleChangeData(val) {
      this.$emit('change', { ...this.teacherSettings, ...val });
    },
    /**
     * Get selected option from a value
     * @param {Number | String} val value from prop
     * @param {Object} options options of specific combobox
     * @returns a selected option
     */
    getSelectedOption(val, options) {
      if (!this.isSingleFolder) return this.disabledOption;

      return options.find(o => o.value === val);
    },
    /**
     * To create initial data
     */
    initData() {
      this.dataUI = [
        {
          name: 'Teacher Portraits',
          options: this.yesNoOptions,
          selected: this.hasTeacher,
          onChangeFn: this.onChangeHasTeacher,
          nudgeWidth: 80,
          isDisabled: this.isDisabledHasTeacher
        },
        {
          name: 'Assistant Teacher Portraits',
          options: this.yesNoOptions,
          selected: this.hasAssistantTeacher,
          onChangeFn: this.onChangeHasAsstTeacher,
          nudgeWidth: 80,
          isDisabled: this.isDisabledHasAsstTeacher
        },
        {
          name: 'Teacher Placement',
          options: this.teacherPlacementOptions,
          selected: this.teacherPlacement,
          onChangeFn: this.onChangeTeacherPlacement,
          isDisabled: this.isDisabledTeacherPlacement
        },
        {
          name: 'Teacher Portrait Size',
          options: this.portraitSizeOptions,
          selected: this.teacherPortraitSize,
          onChangeFn: this.onChangeTeacherSize,
          isDisabled: this.isDisabledTeacherPortraitSize
        },
        {
          name: 'Assistant Teacher Placement',
          options: this.assistantPlacementOptions,
          selected: this.asstTeacherPlacement,
          onChangeFn: this.onChangeAsstPlacement,
          isDisabled: this.isDisabledAsstPlacement
        },
        {
          name: 'Assistant Teacher Portrait Size',
          options: this.portraitSizeOptions,
          selected: this.asstTeacherPortraitSize,
          onChangeFn: this.onChangeAsstSize,
          isDisabled: this.isDisabledAsstPortraitSize
        }
      ];
    }
  }
};
