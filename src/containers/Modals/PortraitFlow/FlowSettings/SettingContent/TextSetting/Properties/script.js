import FontFamily from '@/components/Properties/Groups/TextProperties/FontFamily';
import FontSize from '@/components/Properties/Groups/TextProperties/FontSize';
import Presentation from '@/components/Properties/Groups/TextProperties/Presentation';
import TextCase from '@/components/Properties/Groups/TextProperties/TextCase';
import Alignment from '@/components/Properties/Groups/TextProperties/Alignment';
import ColorPicker from '@/containers/ColorPicker';

import { getSelectedOption, isEqualString, isEmpty } from '@/common/utils';
import { useText } from '@/views/CreateBook/composables';
import {
  FONT_SIZE,
  PRESENTATION,
  TEXT_HORIZONTAL_ALIGN
} from '@/common/constants';

export default {
  components: {
    FontFamily,
    FontSize,
    ColorPicker,
    Presentation,
    TextCase,
    Alignment
  },
  props: {
    fontSettings: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { getFonts } = useText();
    return { getFonts };
  },
  computed: {
    selectedFont() {
      if (isEmpty(this.fontFamily)) return {};
      const selected = this.fontFamily.find(font =>
        isEqualString(font.name, this.fontSettings.fontFamily)
      );
      return this.disabled
        ? getSelectedOption('')
        : getSelectedOption(selected);
    },
    selectedSize() {
      const { fontSize } = this.fontSettings;

      const selected = FONT_SIZE.find(item => item.value === fontSize);
      return this.disabled
        ? getSelectedOption('')
        : getSelectedOption(selected || fontSize, 'pt');
    },
    colorVal() {
      return this.fontSettings.color;
    },
    selectedStyles() {
      const isBold = this.fontSettings.isBold;

      const isItalic = this.fontSettings.isItalic;

      const isUnderline = this.fontSettings.isUnderline;

      const selected = [
        isBold ? PRESENTATION.BOLD : '',
        isItalic ? PRESENTATION.ITALIC : '',
        isUnderline ? PRESENTATION.UNDERLINE : ''
      ];

      return this.disabled ? [] : selected.filter(s => s !== '');
    },
    selectedCase() {
      return this.disabled ? '' : this.fontSettings.textCase;
    },
    selectedAlignment() {
      return this.disabled
        ? TEXT_HORIZONTAL_ALIGN.JUSTIFY
        : this.fontSettings.alignment.horizontal;
    }
  },
  created() {
    this.fontFamily = this.getFonts();
  },
  methods: {
    /**
     * Emit color value to parent
     * @param {String}  color color value user selected
     */
    onChangeColor(color) {
      this.$emit('change', { color });
    },
    /**
     * Emit font fontSize/family/presentation/text case value to parent
     * @param {Object}  data font family/presentation/text case value user entered or selected
     */
    onChange(data) {
      this.$emit('change', data);
    }
  }
};
