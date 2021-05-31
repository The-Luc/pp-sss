import { mapGetters, mapMutations } from 'vuex';

import PpCombobox from '@/components/Combobox';
import { ICON_LOCAL } from '@/common/constants';

import { isEmpty } from '@/common/utils';

import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';

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
    selectedSize() {
      const selectedSize = this.getTextStyle().fontSize;

      const selected = this.items.find(
        item => `${item.value}` === `${selectedSize}`
      );

      const selectedFontSize = isEmpty(selected)
        ? { label: `${selectedSize} pt`, value: selectedSize }
        : selected;

      return selectedFontSize;
    }
  },
  methods: {
    ...mapGetters({
      getTextStyle: PRINT_GETTERS.TEXT_STYLE
    }),
    ...mapMutations({
      setTextStyle: PRINT_MUTATES.SET_TEXT_STYLE
    }),
    /**
     * Set size for object text
     * @param   {Any} val size of text (string or object)
     */
    onChange(data) {
      if (isEmpty(data)) return;

      const value = typeof data === 'string' ? data : data.value;

      const styles = { fontSize: value };

      this.setTextStyle(styles);

      this.$root.$emit('printChangeTextProp', styles);
    }
  }
};
