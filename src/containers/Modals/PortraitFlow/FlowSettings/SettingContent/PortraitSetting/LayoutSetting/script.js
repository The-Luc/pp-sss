import PpCombobox from '@/components/Selectors/Combobox';
import {
  ICON_LOCAL,
  PRINT_COL_ROW_RANGE,
  DIGITAL_COL_RANGE,
  DIGITAL_ROW_RANGE,
  PORTRAIT_MARGIN_OPTIONS
} from '@/common/constants';
import { getValueInput, validateInputOption } from '@/common/utils';

export default {
  components: {
    PpCombobox
  },
  props: {
    layoutSettings: {
      type: Object,
      default: () => ({})
    },
    isPageTitleOn: {
      type: Boolean
    },
    isDigital: {
      type: Boolean
    }
  },
  data() {
    return {
      marginOptions: PORTRAIT_MARGIN_OPTIONS,
      colOptions: null,
      rowOptions: null,
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      dataUI: null,
      componentKey: true
    };
  },
  watch: {
    layoutSettings: {
      deep: true,
      handler() {
        this.initData();
      }
    },
    isPageTitleOn() {
      this.initData();
    }
  },
  computed: {
    selectedRow() {
      return this.rowOptions.find(
        o => o.value === this.layoutSettings.rowCount
      );
    },
    selectedCol() {
      return this.colOptions.find(
        o => o.value === this.layoutSettings.colCount
      );
    },
    selectedTop() {
      const top = this.layoutSettings.margins.top;
      return { name: top + '"', value: top };
    },
    selectedBottom() {
      const bottom = this.layoutSettings.margins.bottom;
      return { name: bottom + '"', value: bottom };
    },
    selectedLeft() {
      const left = this.layoutSettings.margins.left;
      return { name: left + '"', value: left };
    },
    selectedRight() {
      const right = this.layoutSettings.margins.right;
      return { name: right + '"', value: right };
    },
    isDisabledBottom() {
      return this.layoutSettings.rowCount === 1 ? true : false;
    },
    isDisabledRight() {
      return this.layoutSettings.colCount === 1 ? true : false;
    }
  },
  created() {
    this.initData();
  },
  methods: {
    /**
     * Fire when user change row
     */
    onChangeRow(val) {
      const value = this.validateInput(val, this.rowOptions, 0);
      if (!value) return;

      this.emitEvent({ rowCount: value });
    },

    /**
     * Fire when user change column
     */
    onChangeCol(val) {
      const value = this.validateInput(val, this.colOptions, 0);
      if (!value) return;

      this.emitEvent({ colCount: value });
    },

    /**
     * Fire when user change top margin
     */
    onChangeTop(val) {
      const value = this.validateInput(val, this.marginOptions, 2);
      if (!value) return;

      this.onChangeMargins({ top: value });
    },

    /**
     * Fire when user change bottom margin
     */
    onChangeBottom(val) {
      const value = this.validateInput(val, this.marginOptions, 2);
      if (!value) return;

      this.onChangeMargins({ bottom: value });
    },

    /**
     * Fire when user change left margin
     */
    onChangeLeft(val) {
      const value = this.validateInput(val, this.marginOptions, 2);
      if (!value) return;

      this.onChangeMargins({ left: value });
    },

    /**
     * Fire when user change right margin
     */
    onChangeRight(val) {
      const value = this.validateInput(val, this.marginOptions, 2);
      if (!value) return;

      this.onChangeMargins({ right: value });
    },
    /**
     * to call emit data
     */
    onChangeMargins(val) {
      const margins = { ...this.layoutSettings.margins, ...val };
      this.emitEvent({ margins });
    },
    /**
     * emit data to update in portraitSettings data
     */
    emitEvent(val) {
      this.$emit('change', { ...this.layoutSettings, ...val });
    },

    /**
     * To validate value from input field
     * @param {Object} val Object get from input field
     * @param {Object} options Object that user choose from combobox
     * @param {Number} decimal number indicate decimal places
     * @returns a value from input field
     */
    validateInput(val, options, decimal) {
      const { isValid, value } = validateInputOption(
        getValueInput(val),
        options[0].value,
        options[options.length - 1].value,
        decimal,
        options
      );

      if (!isValid) {
        this.componentKey = !this.componentKey;
        return;
      }

      return value;
    },
    /**
     * To get col range of portrait
     * @returns <object> max and min column numbers
     */
    getColRange() {
      const min = this.isDigital
        ? DIGITAL_COL_RANGE.MIN
        : PRINT_COL_ROW_RANGE.MIN;
      const max = this.isDigital
        ? DIGITAL_COL_RANGE.MAX
        : PRINT_COL_ROW_RANGE.MAX;
      return { max, min };
    },
    /**
     * To get col range of portrait
     * @returns <object> max and min column numbers
     */
    getRowRange() {
      const min = this.isDigital
        ? DIGITAL_ROW_RANGE.MIN
        : PRINT_COL_ROW_RANGE.MIN;
      const max = this.isDigital
        ? DIGITAL_ROW_RANGE.MAX
        : PRINT_COL_ROW_RANGE.MAX;
      return { max, min };
    },
    /**
     * To create an array of option based on its min-max
     * @param {Number} min lower bound of range
     * @param {Number} max upper bound of range
     * @returns <Array> of options
     */
    createOptions(min, max) {
      const range = max - min + 1;

      return Array.from({ length: range }, (_, i) => {
        const val = i + min;
        return {
          name: val + '',
          value: val
        };
      });
    },

    /**
     * To create initial data
     */
    initData() {
      const { min: minRow, max: maxRow } = this.getRowRange();
      const { min: minCol, max: maxCol } = this.getColRange();

      this.rowOptions = this.createOptions(minRow, maxRow);
      this.colOptions = this.createOptions(minCol, maxCol);

      this.dataUI = [
        {
          name: 'Rows',
          options: this.rowOptions,
          selected: this.selectedRow,
          onChangeFn: this.onChangeRow
        },
        {
          name: 'Columns',
          options: this.colOptions,
          selected: this.selectedCol,
          onChangeFn: this.onChangeCol
        },
        {
          name: 'Top Margin',
          options: this.marginOptions,
          selected: this.selectedTop,
          onChangeFn: this.onChangeTop
        },
        {
          name: 'Bottom Margin',
          options: this.marginOptions,
          selected: this.selectedBottom,
          onChangeFn: this.onChangeBottom,
          isDisabled: this.isDisabledBottom
        },
        {
          name: 'Left Margin',
          options: this.marginOptions,
          selected: this.selectedLeft,
          onChangeFn: this.onChangeLeft
        },
        {
          name: 'Right Margin',
          options: this.marginOptions,
          selected: this.selectedRight,
          onChangeFn: this.onChangeRight,
          isDisabled: this.isDisabledRight
        }
      ];
    }
  }
};
