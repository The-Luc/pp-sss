import PpCombobox from '@/components/Selectors/Combobox';

import { useElementProperties } from '@/hooks';
import { ICON_LOCAL } from '@/common/constants';
import {
  getSelectedOption,
  getValueInput,
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
      componentKey: true,
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
      if (!isValid) {
        this.componentKey = !this.componentKey;
        return;
      }

      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, { letterSpacing });
    }
  }
};
