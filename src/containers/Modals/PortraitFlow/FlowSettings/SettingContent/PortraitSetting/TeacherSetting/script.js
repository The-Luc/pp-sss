import PpCombobox from '@/components/Selectors/Combobox';
import { ICON_LOCAL, PORTRAIT_MARGIN_OPTIONS } from '@/common/constants';

export default {
  components: {
    PpCombobox
  },
  data() {
    return {
      marginOptions: PORTRAIT_MARGIN_OPTIONS,
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      dataUI: null
    };
  },
  methods: {
    onChangeTeacherInclude() {
      //
    },
    onChangeAsstInclude() {
      //
    },
    onChangeTeacherPlacement() {
      //
    },
    onChangeTeacherSize() {
      //
    },
    onChangeAsstPlacement() {
      //
    },
    onChangeAsstSize() {
      //
    }
  },

  created() {
    this.dataUI = [
      {
        name: 'Teacher Portraits',
        options: this.marginOptions,
        selected: this.marginOptions[0],
        onChangeFn: this.onChangeTeacherInclude
      },
      {
        name: 'Assistant Teacher Portraits',
        options: this.marginOptions,
        selected: this.marginOptions[0],
        onChangeFn: this.onChangeAsstInclude
      },
      {
        name: 'Teacher Placement',
        options: this.marginOptions,
        selected: this.marginOptions[0],
        onChangeFn: this.onChangeTeacherPlacement
      },
      {
        name: 'Teacher Portrait Size',
        options: this.marginOptions,
        selected: this.marginOptions[0],
        onChangeFn: this.onChangeTeacherSize
      },
      {
        name: 'Assistant Teacher Placement',
        options: this.marginOptions,
        selected: this.marginOptions[0],
        onChangeFn: this.onChangeAsstPlacement
      },
      {
        name: 'Assistant Teacher Portrait Size',
        options: this.marginOptions,
        selected: this.marginOptions[0],
        onChangeFn: this.onChangeAsstSize
      }
    ];
  }
};
