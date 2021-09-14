import FontFamily from '@/components/Properties/Groups/TextProperties/FontFamily';
import FontSize from '@/components/Properties/Groups/TextProperties/FontSize';
import Presentation from '@/components/Properties/Groups/TextProperties/Presentation';
import TextCase from '@/components/Properties/Groups/TextProperties/TextCase';
import Alignment from '@/components/Properties/Groups/TextProperties/Alignment';
import ColorPicker from '@/containers/ColorPicker';

import { getSelectedOption } from '@/common/utils';
import {
  FONT_SIZE,
  FONT_FAMILY,
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
  computed: {
    selectedFont() {
      const selected = FONT_FAMILY.find(
        font => font.value === this.fontSettings.fontFamily.toLowerCase()
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
      return this.fontSettings.fontColor;
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
  methods: {
    /**
     * Emit font size value to parent
     * @param {Number}  fontSize font size value user entered
     */
    onChangFontSize(fontSize) {
      this.$emit('change', { fontSize });
    },
    /**
     * Emit color value to parent
     * @param {String}  fontColor color value user selected
     */
    onChangeColor(fontColor) {
      this.$emit('change', { fontColor });
    },
    /**
     * Emit font family/presentation/text case value to parent
     * @param {Object}  data font family/presentation/text case value user entered or selected
     */
    onChange(data) {
      this.$emit('change', data);
    }
  }
};
