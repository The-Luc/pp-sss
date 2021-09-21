import PpSelect from '@/components/Selectors/Select';
import FontSize from '@/components/Properties/Groups/TextProperties/FontSize';
import FontFamily from '@/components/Properties/Groups/TextProperties/FontFamily';

import { useElementProperties } from '@/hooks';
import { FONT_SIZE, FONT_FAMILY } from '@/common/constants';
import { getSelectedOption, pxToIn, getActiveCanvas } from '@/common/utils';

import { EVENT_TYPE } from '@/common/constants/eventType';

export default {
  components: {
    PpSelect,
    FontSize,
    FontFamily
  },
  setup() {
    const { getProperty } = useElementProperties();

    return {
      getProperty
    };
  },
  computed: {
    selectedFont() {
      const selectedFont = this.getProperty('fontFamily') || 'Arial';

      const selected = FONT_FAMILY.find(
        font => font.value === selectedFont.toLowerCase()
      );

      return { name: selected.name, value: selected.value };
    },
    selectedSize() {
      const selectedSize = this.getProperty('fontSize') || 60;

      const selected = FONT_SIZE.find(item => item.value === selectedSize);
      return getSelectedOption(selected || selectedSize, 'pt');
    }
  },
  methods: {
    /**
     * Set size for object text
     * @param {Any} data size of text (string or object)
     */
    onChangFontSize(value) {
      const activeObj = getActiveCanvas()?.getActiveObject();
      const { x, y } = activeObj?.aCoords?.tl || {};
      const updateData = {
        fontSize: value,
        coord: {
          x: pxToIn(x),
          y: pxToIn(y)
        }
      };

      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, updateData);
    },
    /**
     * Change font family of text box selected
     * @param {Object} data new font family of text box
     */
    onChangFontFamily(value) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, value);
    }
  }
};
