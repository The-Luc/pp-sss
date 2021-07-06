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
  props: {
    pageInfo: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      prependedIcon: ICON_LOCAL.PREPENDED_FONT_SIZE,
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMILY
    };
  },
  computed: {
    selectedFontFamily() {
      const font = this.fontFamily.find(
        item => item.value === this.pageInfo.fontFamily.toLowerCase()
      );

      return { name: font.name, value: font.value };
    },
    selectedFontSize() {
      const font = this.fontSize.find(
        item => item.value === this.pageInfo.fontSize
      );

      return { name: font.name, value: font.value };
    }
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
