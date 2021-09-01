import PpButtonGroup from '@/components/Buttons/ButtonGroup';
import { PRESENTATION } from '@/common/constants';

export default {
  components: {
    PpButtonGroup
  },
  props: {
    selectedStyles: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      BOLD: PRESENTATION.BOLD,
      ITALIC: PRESENTATION.ITALIC,
      UNDERLINE: PRESENTATION.UNDERLINE
    };
  },
  methods: {
    /**
     * Emit to back value to parent
     * @param {String} data value to change
     */
    onChange(data) {
      const isBold = data.indexOf(this.BOLD) >= 0;
      const isItalic = data.indexOf(this.ITALIC) >= 0;
      const isUnderline = data.indexOf(this.UNDERLINE) >= 0;

      this.$emit('change', {
        isBold,
        isItalic,
        isUnderline
      });
    }
  }
};
