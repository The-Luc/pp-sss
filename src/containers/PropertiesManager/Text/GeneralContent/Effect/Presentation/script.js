import PpButtonGroup from '@/components/Buttons/ButtonGroup';
import { useElementProperties } from '@/hooks';
import { EVENT_TYPE } from '@/common/constants/eventType';

export default {
  components: {
    PpButtonGroup
  },
  setup() {
    const { getProperty } = useElementProperties();

    return {
      getProperty
    };
  },
  data() {
    return {
      BOLD: 'bold',
      ITALIC: 'italic',
      UNDERLINE: 'underline'
    };
  },
  computed: {
    selectedStyles() {
      const isBold = this.getProperty('isBold') || false;

      const isItalic = this.getProperty('isItalic') || false;

      const isUnderline = this.getProperty('isUnderline') || false;

      const selected = [
        isBold ? this.BOLD : '',
        isItalic ? this.ITALIC : '',
        isUnderline ? this.UNDERLINE : ''
      ];

      return selected.filter(s => s !== '');
    }
  },
  methods: {
    onChange(data) {
      const isBold = data.indexOf(this.BOLD) >= 0;
      const isItalic = data.indexOf(this.ITALIC) >= 0;
      const isUnderline = data.indexOf(this.UNDERLINE) >= 0;

      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        isBold,
        isItalic,
        isUnderline
      });
    }
  }
};
