import PpCombobox from '@/components/Selectors/Combobox';
import {
  ICON_LOCAL,
  PORTRAIT_COL_ROW_RANGE,
  PORTRAIT_MARGIN_OPTIONS
} from '@/common/constants';

export default {
  components: {
    PpCombobox
  },
  props: {
    layoutSettings: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const marginOptions = PORTRAIT_MARGIN_OPTIONS;

    const min = PORTRAIT_COL_ROW_RANGE.MIN;
    const max = PORTRAIT_COL_ROW_RANGE.MAX;
    const range = max - min + 1;

    const colRowOptions = Array.from({ length: range }, (_, i) => {
      const val = i + min;
      return {
        name: val + '',
        value: val
      };
    });
    return {
      marginOptions,
      colRowOptions,
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      dataUI: null
    };
  },
  computed: {
    selectedRow() {
      return this.colRowOptions.find(
        o => o.value === this.layoutSettings.rowCount
      );
    },
    selectedCol() {
      return this.colRowOptions.find(
        o => o.value === this.layoutSettings.colCount
      );
    },
    selectedTop() {
      return this.marginOptions.find(
        o => o.value === this.layoutSettings.margins.top
      );
    },
    selectedBottom() {
      return this.marginOptions.find(
        o => o.value === this.layoutSettings.margins.bottom
      );
    },
    selectedLeft() {
      return this.marginOptions.find(
        o => o.value === this.layoutSettings.margins.left
      );
    },
    selectedRight() {
      return this.marginOptions.find(
        o => o.value === this.layoutSettings.margins.right
      );
    }
  },
  methods: {
    /**
     * Fire when user change row
     */
    onChangeRow(val) {
      this.emitEvent({ rowCount: +val || val.value });
    },

    /**
     * Fire when user change column
     */
    onChangeCol(val) {
      this.emitEvent({ colCount: +val || val.value });
    },

    /**
     * Fire when user change top margin
     */
    onChangeTop(val) {
      this.onChangeMargins({ top: +val || val.value });
    },

    /**
     * Fire when user change bottom margin
     */
    onChangeBottom(val) {
      this.onChangeMargins({ bottom: +val || val.value });
    },

    /**
     * Fire when user change left margin
     */
    onChangeLeft(val) {
      this.onChangeMargins({ left: +val || val.value });
    },

    /**
     * Fire when user change right margin
     */
    onChangeRight(val) {
      this.onChangeMargins({ right: +val || val.value });
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
    }
  },

  created() {
    this.dataUI = [
      {
        name: 'Row',
        options: this.colRowOptions,
        selected: this.selectedRow,
        onChangeFn: this.onChangeRow
      },
      {
        name: 'Col',
        options: this.colRowOptions,
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
        onChangeFn: this.onChangeBottom
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
        onChangeFn: this.onChangeRight
      }
    ];
  }
};
