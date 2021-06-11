import { mapGetters } from 'vuex';

import PpCombobox from '@/components/Combobox';
import { ICON_LOCAL } from '@/common/constants';
import {
  getSelectedOption,
  getValueInput,
  validateInputOption
} from '@/common/utils';

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

      return getSelectedOption(selected || selectedSize, 'pt');
    }
  },
  methods: {
    /**
     * Set size for object text
     * @param {Any} val size of text (string or object)
     */
    onChange(data) {
      const { isValid, value } = validateInputOption(
        getValueInput(data),
        1,
        500,
        0,
        this.items,
        'pt'
      );
      const updateData = isValid ? { fontSize: value } : {};
      this.$root.$emit('printChangeTextProperties', updateData);
    }
  }
};
