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
  data() {
    const marginOptions = PORTRAIT_MARGIN_OPTIONS;

    const min = PORTRAIT_COL_ROW_RANGE.MIN;
    const max = PORTRAIT_COL_ROW_RANGE.MAX;
    const range = max - min + 1;

    const colRolOptions = Array.from({ length: range }, (_, i) => {
      const val = i + min;
      return {
        name: val + '',
        value: val
      };
    });
    return {
      marginOptions,
      colRolOptions,
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      dataUI: null
    };
  },
  methods: {
    onChangeRow() {
      console.log('change row');
      //
    },
    onChangeCol() {
      //
    },
    onChangeTop() {
      //
    },
    onChangeBottom() {
      //
    },
    onChangeLeft() {
      //
    },
    onChangeRight() {
      //
    }
  },

  created() {
    this.dataUI = [
      {
        name: 'Teacher Portraits',
        options: this.colRolOptions,
        selected: 0,
        onChangeFn: this.onChangeRow
      },
      {
        name: 'Assistant Teacher Portraits',
        options: this.colRolOptions,
        selected: 0,
        onChangeFn: this.onChangeCol
      },
      {
        name: 'Teacher Placement',
        options: this.marginOptions,
        selected: 0,
        onChangeFn: this.onChangeTop
      },
      {
        name: 'Teacher Portrait Size',
        options: this.marginOptions,
        selected: 0,
        onChangeFn: this.onChangeBottom
      },
      {
        name: 'Assistant Teacher Placement',
        options: this.marginOptions,
        selected: 0,
        onChangeFn: this.onChangeLeft
      },
      {
        name: 'Assistant Teacher Portrait Size',
        options: this.marginOptions,
        selected: 0,
        onChangeFn: this.onChangeRight
      }
    ];
  }
};
