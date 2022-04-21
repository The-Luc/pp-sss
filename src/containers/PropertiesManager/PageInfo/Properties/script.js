import PpCombobox from '@/components/Selectors/Combobox';
import PpSelect from '@/components/Selectors/Select';
import ColorPicker from '@/containers/ColorPicker';
import { ICON_LOCAL, FONT_SIZE, DEFAULT_COLOR } from '@/common/constants';
import { useText } from '@/views/CreateBook/composables';
import {
  getValueInput,
  validateInputOption,
  getSelectedOption,
  isEqualString
} from '@/common/utils';

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
    },
    disabled: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const { getFonts } = useText();

    return {
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      prependedIcon: ICON_LOCAL.PREPENDED_FONT_SIZE,
      fontSize: FONT_SIZE,
      fontFamily: [],
      getFonts
    };
  },
  computed: {
    selectedFontFamily() {
      const font = this.fontFamily.find(item =>
        isEqualString(item.name, this.pageInfo.fontFamily)
      );

      return { name: font.name, value: font.value };
    },
    selectedFontSize() {
      const font = this.fontSize.find(
        item => item.value === this.pageInfo.fontSize
      );

      return font
        ? getSelectedOption(font)
        : getSelectedOption(this.pageInfo.fontSize, 'pt');
    },
    color() {
      return this.disabled ? DEFAULT_COLOR.DISABLED_COLOR : this.pageInfo.color;
    }
  },
  created() {
    this.fontFamily = this.getFonts();
  },
  methods: {
    /**
     * Emit font family change to parent
     * @param {Object} fontFamily - value font family selected
     */
    onChangeFontFamily(fontFamily) {
      this.$emit('change', { fontFamily: fontFamily.name });
    },
    /**
     * Emit font size change to parent
     * @param {Object} fontSize - value font size selected
     */
    onChangeFontSize(fontSize) {
      const { isValid, value } = validateInputOption(
        getValueInput(fontSize),
        1,
        500,
        0,
        this.items,
        'pt'
      );
      const updateFontSize = isValid ? { fontSize: value } : {};
      this.$emit('change', updateFontSize);
    },
    /**
     * Emit color change to parent
     * @param {String} color - value color selected
     */
    onChangeColor(color) {
      this.$emit('change', { color });
    }
  }
};
