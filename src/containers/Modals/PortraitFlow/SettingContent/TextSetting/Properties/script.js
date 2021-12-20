import FontFamily from '@/components/TextProperties/FontFamily';
import FontSize from '@/components/TextProperties/FontSize';
import Presentation from '@/components/TextProperties/Presentation';
import TextCase from '@/components/TextProperties/TextCase';
import ColorPicker from '@/containers/ColorPicker';

export default {
  components: {
    FontFamily,
    FontSize,
    ColorPicker,
    Presentation,
    TextCase
  },
  computed: {
    selectedFont() {
      return { name: '', value: '' };
    },
    selectedSize() {
      return { name: '', value: '' };
    },
    colorVal() {
      return '#000000';
    },
    selectedStyles() {
      return [];
    },
    selectedCase() {
      return '';
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
     * @param {String}  color color value user selected
     */
    onChangeColor(color) {
      this.$emit('change', { color });
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
