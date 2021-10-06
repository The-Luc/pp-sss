import PpCombobox from '@/components/Selectors/Combobox';
import PpSelect from '@/components/Selectors/Select';
import {
  getValueInput,
  validateInputOption,
  getSelectedOption
} from '@/common/utils';
import {
  ICON_LOCAL,
  TEXT_DISPLAY_OPTION,
  TEXT_POSITION_OPTION,
  NAME_GAP_OPTION,
  NAME_WIDTH_OPTION,
  PORTRAIT_NAME_POSITION,
  NAME_LINES_OPTION,
  MIN_MAX_TEXT_SETTINGS,
  DEFAULT_NAME_WIDTH,
  DEFAULT_NAME_LINES
} from '@/common/constants';

export default {
  components: {
    PpCombobox,
    PpSelect
  },
  props: {
    textSettings: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      componentKey: true,
      textPosition: TEXT_POSITION_OPTION,
      textDisplay: TEXT_DISPLAY_OPTION,
      nameGap: NAME_GAP_OPTION,
      appendedIcon: ICON_LOCAL.APPENDED_ICON
    };
  },
  computed: {
    displayVal() {
      return this.textSettings.nameDisplay;
    },
    positionVal() {
      return this.textSettings.namePosition;
    },
    gapVal() {
      const { nameGap } = this.textSettings;
      return getSelectedOption(nameGap, '', `${nameGap}"`);
    },
    widthVal() {
      const { nameWidth } = this.textSettings;
      return getSelectedOption(nameWidth, '', `${nameWidth}"`);
    },
    linesVal() {
      const { nameLines } = this.textSettings;
      return getSelectedOption(nameLines);
    },
    optionPositionVal() {
      return this.isCenterPosition
        ? {
            name: 'Lines',
            value: this.linesVal,
            items: NAME_LINES_OPTION,
            onChangeFn: this.onChangeLines
          }
        : {
            name: 'Width',
            value: this.widthVal,
            items: NAME_WIDTH_OPTION,
            onChangeFn: this.onChangeWidth
          };
    },
    isCenterPosition() {
      return (
        this.textSettings.namePosition.value ===
        PORTRAIT_NAME_POSITION.CENTERED.value
      );
    }
  },
  methods: {
    /**
     * Emit text display value to parent
     * @param {Object}  data text display value user selected
     */
    onChangeDisplay(data) {
      this.$emit('change', { nameDisplay: data });
    },
    /**
     * Emit text position value to parent
     * @param {Object}  data text position value user selected
     */
    onChangePosition(data) {
      this.$emit('change', {
        namePosition: data,
        nameGap: DEFAULT_NAME_LINES,
        nameLines: MIN_MAX_TEXT_SETTINGS.MIN_LINES,
        nameWidth: DEFAULT_NAME_WIDTH
      });
    },
    /**
     * Emit name width value to parent
     * @param {Object}  data name width value user selected
     */
    onChangeWidth(data) {
      const { isValid, value } = validateInputOption(
        getValueInput(data),
        MIN_MAX_TEXT_SETTINGS.MIN_WIDTH,
        MIN_MAX_TEXT_SETTINGS.MAX_WIDTH,
        2
      );

      if (!isValid) {
        this.forceRenderComponent();
        return;
      }
      this.$emit('change', { nameWidth: value });
    },
    /**
     * Emit name lines value to parent
     * @param {Object}  data name width value user selected
     */
    onChangeLines(data) {
      const { isValid, value } = validateInputOption(
        getValueInput(data),
        MIN_MAX_TEXT_SETTINGS.MIN_LINES,
        MIN_MAX_TEXT_SETTINGS.MAX_LINES,
        0
      );

      if (!isValid) {
        this.forceRenderComponent();
        return;
      }
      this.$emit('change', { nameLines: value });
    },
    /**
     * Emit name gap value to parent
     * @param {Object}  data  name gap value user selected
     */
    onChangeGap(data) {
      const { isValid, value } = validateInputOption(
        getValueInput(data),
        MIN_MAX_TEXT_SETTINGS.MIN_GAP,
        MIN_MAX_TEXT_SETTINGS.MAX_GAP,
        3
      );

      if (!isValid) {
        this.forceRenderComponent();
        return;
      }
      this.$emit('change', { nameGap: value });
    },
    /**
     * Trigger render component by changing component key
     */
    forceRenderComponent() {
      this.componentKey = !this.componentKey;
    }
  }
};
