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
    /**
     * Emit font family change to parent
     * @param {Boolean} val - value font family selected
     */
    onChangeFontFamily(val) {
      this.$emit('change', { fontFamily: val });
    },
    /**
     * Emit font size change to parent
     * @param {Boolean} val - value font size selected
     */
    onChangeFontSize(val) {
      this.$emit('change', { fontSize: val });
    },
    /**
     * Emit color change to parent
     * @param {Boolean} val - value color selected
     */
    onChangeColor(val) {
      this.$emit('change', { color: val });
    }
  }
};
