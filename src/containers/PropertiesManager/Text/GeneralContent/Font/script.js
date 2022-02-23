import PpSelect from '@/components/Selectors/Select';
import FontSize from '@/components/Properties/Groups/TextProperties/FontSize';
import FontFamily from '@/components/Properties/Groups/TextProperties/FontFamily';

import { useElementProperties } from '@/hooks';
import { FONT_SIZE } from '@/common/constants';
import { getSelectedOption } from '@/common/utils';

import { EVENT_TYPE } from '@/common/constants/eventType';
import { useText } from '@/views/CreateBook/composables';
import { isEqualString } from '../../../../../common/utils/util';

export default {
  components: {
    PpSelect,
    FontSize,
    FontFamily
  },
  setup() {
    const { getProperty } = useElementProperties();
    const { getFonts } = useText();

    return {
      getProperty,
      getFonts,
      fontFamily: []
    };
  },
  computed: {
    selectedFont() {
      const selectedFont = this.getProperty('fontFamily') || 'Arial';

      const selected = this.fontFamily.find(font =>
        isEqualString(font.name, selectedFont)
      );

      return { name: selected?.name, value: selected?.value };
    },
    selectedSize() {
      const selectedSize = this.getProperty('fontSize') || 60;

      const selected = FONT_SIZE.find(item => item.value === selectedSize);
      return getSelectedOption(selected || selectedSize, 'pt');
    }
  },
  created() {
    this.fontFamily = this.getFonts();
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
