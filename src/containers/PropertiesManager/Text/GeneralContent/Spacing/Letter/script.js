import { mapGetters } from 'vuex';

import PpCombobox from '@/components/Combobox';
import { ICON_LOCAL } from '@/common/constants';
import { LETTER_SPACING } from '@/mock/letterSpacing';

import { isEmpty } from '@/common/utils';
import { GETTERS } from '@/store/modules/book/const';

export default {
  components: {
    PpCombobox
  },
  data() {
    return {
      prependedIcon: ICON_LOCAL.PREPENDED_LETTER,
      appendedIcon: ICON_LOCAL.APPENED_ICON,
      items: LETTER_SPACING
    };
  },
  computed: {
    ...mapGetters({
      selectedId: GETTERS.SELECTED_OBJECT_ID,
      selectedFontSize: GETTERS.PROP_OBJECT_BY_ID,
      triggerChange: GETTERS.TRIGGER_OBJECT_CHANGE
    }),
    selectedLetterSpacing() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const selectedCharSpacing =
        this.selectedFontSize({ id: this.selectedId, prop: 'charSpacing' }) ||
        0;
      const selected = this.items.find(
        item => item.value === selectedCharSpacing
      );
      console.log(this.getValLetterSpacing(selected || selectedCharSpacing));
      return this.getValLetterSpacing(selected || selectedCharSpacing);
    }
  },
  methods: {
    /**
     * Set value letter spacing for object text
     * @param   {Any} val value letter spacing of text (string or object)
     */
    onChange(data) {
      if (isEmpty(data)) {
        this.$root.$emit('printChangeTextProperties', {});

        return;
      }

      const isString = typeof data === 'string';

      const digitRegex = new RegExp(/^-?[\d]{1,}$/g);
      if (isString && !digitRegex.test(data)) {
        this.$root.$emit('printChangeTextProperties', {});

        return;
      }

      const value = isString ? parseInt(data, 10) : data.value;

      const acceptValue = value > 1500 ? 1500 : value < -100 ? -100 : value;

      this.$root.$emit('printChangeTextProperties', {
        charSpacing: acceptValue
      });
    },
    /**
     * Get value letter spacing item from data
     * @param   {Any} data  data to make value letter spacing item
     * @returns             value letter spacing item
     */
    getValLetterSpacing(data) {
      if (typeof data === 'object') {
        return { name: data.name, value: data.value };
      }
      return { name: `${data}`, value: data };
    }
  }
};
