import { mapGetters } from 'vuex';

import PpCombobox from '@/components/Combobox';
import { ICON_LOCAL } from '@/common/constants';

import { isEmpty } from '@/common/utils';

import { GETTERS } from '@/store/modules/book/const';

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
      prependedIcon: ICON_LOCAL.PREPENDED_FONT_SIZE
    };
  },
  computed: {
    ...mapGetters({
      selectedId: GETTERS.SELECTED_OBJECT_ID,
      selectedFontSize: GETTERS.PROP_OBJECT_BY_ID,
      triggerChange: GETTERS.TRIGGER_OBJECT_CHANGE
    }),
    selectedSize() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const selectedSize =
        this.selectedFontSize({ id: this.selectedId, prop: 'fontSize' }) || 60;

      const selected = this.items.find(item => item.value === selectedSize);

      return this.getFontSizeItem(selected || selectedSize);
    }
  },
  methods: {
    /**
     * Set size for object text
     * @param {Any} val size of text (string or object)
     */
    onChange(data) {
      if (isEmpty(data)) {
        this.$root.$emit('printChangeTextProperties', {});

        return;
      }

      const isString = typeof data === 'string';

      const digitRegex = new RegExp(/^[\d]{1,}$/g);

      if (isString && !digitRegex.test(data)) {
        this.$root.$emit('printChangeTextProperties', {});

        return;
      }

      const value = isString ? parseInt(data, 10) : data.value;

      const acceptValue = value > 500 ? 500 : value < 1 ? 1 : value;

      this.$root.$emit('printChangeTextProperties', { fontSize: acceptValue });
    },
    /**
     * Get font size item from data
     * @param   {Any} data  data to make font size item (font value of font item)
     * @returns             font size item
     */
    getFontSizeItem(data) {
      if (typeof data === 'object') {
        return { name: data.name, value: data.value };
      }

      return { name: `${data} pt`, value: data };
    }
  }
};
