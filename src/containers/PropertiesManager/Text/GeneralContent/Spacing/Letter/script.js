import PpCombobox from '@/components/Selectors/Combobox';

import { useElementProperties } from '@/hooks';
import { ICON_LOCAL } from '@/common/constants';
import {
  activeCanvas,
  getSelectedOption,
  getValueInput,
  pxToIn,
  validateInputOption
} from '@/common/utils';

import { EVENT_TYPE } from '@/common/constants/eventType';

export default {
  components: {
    PpCombobox
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  setup() {
    const { getProperty } = useElementProperties();

    return {
      getProperty
    };
  },
  data() {
    return {
      prependedIcon: ICON_LOCAL.PREPENDED_LETTER,
      appendedIcon: ICON_LOCAL.APPENDED_ICON
    };
  },
  computed: {
    selectedLetterSpacing() {
      const selectedSpacing = this.getProperty('letterSpacing') || 0;
      const selected = this.items.find(item => item.value === selectedSpacing);
      return getSelectedOption(selected || selectedSpacing, '');
    }
  },
  methods: {
    /**
     * Set value letter spacing for object text
     * @param   {Any} val value letter spacing of text (string or object)
     */
    onChange(data) {
      const { isValid, value: letterSpacing } = validateInputOption(
        getValueInput(data),
        -100,
        1500,
        0,
        this.items
      );
      const updateData = isValid ? { letterSpacing } : {};
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, updateData);

      const activeObj = activeCanvas?.getActiveObject();

      const { width, height } = activeObj || {};

      const updatedSize = {
        width: pxToIn(width),
        height: pxToIn(height)
      };

      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        size: updatedSize
      });
    }
  }
};
