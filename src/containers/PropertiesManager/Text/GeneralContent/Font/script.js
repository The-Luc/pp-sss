import PpSelect from '@/components/Selectors/Select';
import FontSize from '@/components/Properties/Groups/TextProperties/FontSize';
import FontFamily from '@/components/Properties/Groups/TextProperties/FontFamily';

import { useElementProperties } from '@/hooks';
import { FONT_SIZE, FONT_FAMILY } from '@/common/constants';
import { getSelectedOption } from '@/common/utils';

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
     * Change fontSize/fontFamily of text box selected
     * @param {Object} data new fontSize/fontFamily of text box
     */
    onChange(value) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, value);
    }
  }
};
