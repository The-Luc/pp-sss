import { mapGetters } from 'vuex';

import PpCombobox from '@/components/Combobox';
import { ICON_LOCAL } from '@/common/constants';

import { isEmpty } from '@/common/utils';

import { GETTERS as PROP_GETTERS } from '@/store/modules/property/const';

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
  data() {
    return {
      appendedIcon: ICON_LOCAL.APPENED_ICON,
      prependedIcon: ICON_LOCAL.PREPENDED_FONT_SIZE,
      triggerChange: true
    };
  },
  computed: {
    selectedSize() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const selectedSize = this.getTextStyle().fontSize;

      const selected = this.items.find(item => item.value === selectedSize);

      return this.getFontSizeItem(selected || selectedSize);
    }
  },
  methods: {
    ...mapGetters({
      getTextStyle: PROP_GETTERS.TEXT_STYLE
    }),
    /**
     * Set size for object text
     * @param   {Any} val size of text (string or object)
     */
    onChange(data) {
      if (isEmpty(data)) {
        this.triggerChange = !this.triggerChange;

        return;
      }

      const isString = typeof data === 'string';

      const digitRegex = new RegExp(/^[\d]{1,}$/g);

      if (isString && !digitRegex.test(data)) {
        this.triggerChange = !this.triggerChange;

        return;
      }

      const value = isString ? parseInt(data, 10) : data.value;

      const acceptValue = value > 500 ? 500 : value < 1 ? 1 : value;

      this.$root.$emit('printChangeTextStyle', { fontSize: acceptValue });

      this.triggerChange = !this.triggerChange;
    },
    /**
     * Get font size item from data
     * @param   {Any} data  data to make font size item (font value of font item)
     * @returns             font size item
     */
    getFontSizeItem(data) {
      if (typeof data === 'object') {
        return { label: data.label, value: data.value };
      }

      return { label: `${data} pt`, value: data };
    }
  }
};
