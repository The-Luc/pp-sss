import Color from '@/containers/ColorPicker';
import Presentation from '@/components/TextProperties/Presentation';
import TextCase from '@/components/TextProperties/TextCase';

import { useElementProperties } from '@/hooks';
import { EVENT_TYPE } from '@/common/constants/eventType';
import { DEFAULT_TEXT, PRESENTATION } from '@/common/constants';

export default {
  components: {
    Color,
    Presentation,
    TextCase
  },
  setup() {
    const { getProperty } = useElementProperties();

    return {
      getProperty
    };
  },
  computed: {
    color() {
      return this.getProperty('color') || DEFAULT_TEXT.COLOR;
    },
    selectedCase() {
      return this.getProperty('textCase') || '';
    },
    selectedStyles() {
      const isBold = this.getProperty('isBold') || false;

      const isItalic = this.getProperty('isItalic') || false;

      const isUnderline = this.getProperty('isUnderline') || false;

      const selected = [
        isBold ? PRESENTATION.BOLD : '',
        isItalic ? PRESENTATION.ITALIC : '',
        isUnderline ? PRESENTATION.UNDERLINE : ''
      ];

      return selected.filter(s => s !== '');
    }
  },
  methods: {
    /**
     * Change Presentation/TextCase of text box selected
     * @param  {String} value Receive value information to change
     */
    onChange(value) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, value);
    },
    /**
     * Change Color of text box selected
     * @param  {String} color Receive value information to change
     */
    onChangeColor(color) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, { color });
    }
  }
};
