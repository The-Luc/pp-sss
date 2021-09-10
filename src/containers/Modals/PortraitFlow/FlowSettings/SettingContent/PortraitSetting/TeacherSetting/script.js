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
    },
    numOfTeachers: {
      type: Number,
      default: 0
    },
    numOfAsstTeachers: {
      type: Number,
      default: 0
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
      if (this.numOfAsstTeachers === 0) return this.disabledOption;

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
      if (
        !this.teacherSettings.hasAssistantTeacher ||
        this.teacherSettings.teacherPlacement ===
          PORTRAIT_TEACHER_PLACEMENT.ALPHABETICAL
      )
        return this.disabledOption;

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
      if (!this.isSingleFolder || !this.isHasTeacher) return true;

      return false;
    },
    isDisabledHasAsstTeacher() {
      if (
        !this.isSingleFolder ||
        !this.teacherSettings.hasTeacher ||
        this.numOfAsstTeachers === 0
      )
        return true;

      return false;
    },
    isDisabledTeacherPlacement() {
      if (!this.isSingleFolder || !this.teacherSettings.hasTeacher) return true;

      return false;
    },
    isDisabledTeacherPortraitSize() {
      const isAlphabetPlacement =
        this.teacherSettings.teacherPlacement ===
        PORTRAIT_TEACHER_PLACEMENT.ALPHABETICAL;

      if (
        !this.isSingleFolder ||
        !this.teacherSettings.hasTeacher ||
        this.numOfTeachers > 2 ||
        isAlphabetPlacement
      )
        return true;

      const isLessThanFour = this.layout.col < 4 && this.layout.row < 4;
      if (isLessThanFour) return true;

      return false;
    },
    isDisabledAsstPlacement() {
      if (
        !this.isSingleFolder ||
        !this.teacherSettings.hasAssistantTeacher ||
        this.teacherSettings.teacherPlacement ===
          PORTRAIT_TEACHER_PLACEMENT.ALPHABETICAL
      )
        return true;

      if (this.isTeacherPortraitLarge && !this.isAsstPortraitLarge) return true;

      return false;
    },
    isDisabledAsstPortraitSize() {
      if (
        !this.isSingleFolder ||
        !this.teacherSettings.hasAssistantTeacher ||
        !this.isTeacherPortraitLarge ||
        (this.isTeacherPortraitLarge && this.numOfTeachers >= 2)
      )
        return true;

      return false;
    },
    isTeacherPortraitLarge() {
      return this.teacherSettings.teacherPortraitSize === PORTRAIT_SIZE.LARGE;
    },
    isAsstPortraitLarge() {
      return (
        this.teacherSettings.assistantTeacherPortraitSize ===
        PORTRAIT_SIZE.LARGE
      );
    },
    isHasTeacher() {
      return this.numOfTeachers > 0;
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
        this.applyRules();

        this.$nextTick(() => {
          this.disableInputField();
        });
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
     * Apply rules to multiple inputs
     */
    applyRules() {
      this.asstPlacementRule();
      this.numberOfLargePortraitsRule();
      this.alphabeticalOrder();
    },
    /**
     * Rule for Assistant placement
     */
    asstPlacementRule() {
      /*
      If Teacher Size is “Large” and assistant teacher is “Same”,
      the assistant portrait has to be “After Teacher” when teacher is in “First Position” 
      and “Before Teacher” when teacher is in the last position
      */
      const {
        teacherPlacement,
        assistantTeacherPlacement
      } = this.teacherSettings;

      if (this.isTeacherPortraitLarge && !this.isAsstPortraitLarge) {
        const asstAfterTeacherValue =
          PORTRAIT_ASSISTANT_PLACEMENT.AFTER_TEACHERS;

        if (
          teacherPlacement === PORTRAIT_TEACHER_PLACEMENT.FIRST &&
          assistantTeacherPlacement !== asstAfterTeacherValue
        ) {
          this.onChangeAsstPlacement(asstAfterTeacherValue);
        }

        const asstBeforeTeacher = PORTRAIT_ASSISTANT_PLACEMENT.BEFORE_TEACHERS;
        if (
          teacherPlacement === PORTRAIT_TEACHER_PLACEMENT.LAST &&
          assistantTeacherPlacement !== asstBeforeTeacher
        ) {
          this.onChangeAsstPlacement(asstBeforeTeacher);
        }
      }
    },
    /**
     * Rule for maximun number of large portraits
     */
    numberOfLargePortraitsRule() {
      /*
      ONLY 2 portraits are allowed to be “Large” at a time. 
      If 2 teachers are large, assistant teacher size option is fixed to “Same” 
      If there are more than 2 teachers, 
      Teacher Size and Assistant Teacher size are all fixed to “Same”
      */
      if (!this.isTeacherPortraitLarge) return;

      if (this.numOfTeachers > 2) {
        // assistant portrait size will be set 'SAME' automatically
        this.onChangeTeacherSize(PORTRAIT_SIZE.SAME);
      }

      if (
        this.numOfTeachers === 2 &&
        this.teacherSettings.assistantTeacherPortraitSize !== PORTRAIT_SIZE.SAME
      ) {
        this.onChangeAsstSize(PORTRAIT_SIZE.SAME);
      }
    },
    /**
     * Rule for teacher placement in alphabetical
     */
    alphabeticalOrder() {
      const { teacherPlacement, teacherPortraitSize } = this.teacherSettings;

      if (
        teacherPlacement === PORTRAIT_TEACHER_PLACEMENT.ALPHABETICAL &&
        teacherPortraitSize !== PORTRAIT_SIZE.SAME
      ) {
        this.onChangeTeacherSize(PORTRAIT_SIZE.SAME);
      }
    },
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
      if (!this.isSingleFolder || this.numOfTeachers === 0)
        return this.disabledOption;

      return options.find(o => o.value === val);
    },
    disableInputField() {
      const teacherSettingsEl = this.$refs.teacherSettings;
      const inputs = teacherSettingsEl.querySelectorAll('input[type="text"]');

      inputs.forEach(input => (input.disabled = true));
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
  },
  mounted() {
    this.disableInputField();
  }
};
