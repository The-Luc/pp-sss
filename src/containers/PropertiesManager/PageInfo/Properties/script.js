import PpCombobox from '@/components/Selectors/Combobox';
import PpSelect from '@/components/Selectors/Select';
import ColorPicker from '@/containers/ColorPicker';
import { ICON_LOCAL, FONT_SIZE, FONT_FAMILY } from '@/common/constants';

export default {
  components: {
    PpCombobox,
    PpSelect,
    ColorPicker
  },
  data() {
    return {
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      prependedIcon: ICON_LOCAL.PREPENDED_FONT_SIZE,
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMILY,
      color: '#000000'
    };
  },
  methods: {
    onChangeFontFamily(val) {
      console.log(val);
    },
    onChangeFontSize(val) {
      console.log(val);
    },
    onChangeColor(val) {
      console.log(val);
    }
  }
};
