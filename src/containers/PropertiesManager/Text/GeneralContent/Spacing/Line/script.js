import { mapGetters } from 'vuex';
import PpCombobox from '@/components/Selectors/Combobox';
import { ICON_LOCAL } from '@/common/constants';
import {
  getSelectedOption,
  getValueInput,
  validateInputOption
} from '@/common/utils';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';

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
      prependedIcon: ICON_LOCAL.PREPENDED_LINE,
      appendedIcon: ICON_LOCAL.APPENDED_ICON
    };
  },
  computed: {
    ...mapGetters({
      selectedObject: PRINT_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: PRINT_GETTERS.TRIGGER_TEXT_CHANGE
    }),
    selectedLineSpacing() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const selectedLineSpacing = this.selectedObject('lineSpacing') || 0;
      const selected = this.items.find(
        item => item.value === selectedLineSpacing
      );
      return selectedLineSpacing === 0
        ? getSelectedOption({ name: 'Auto', value: 'auto' })
        : getSelectedOption(selected || selectedLineSpacing, 'pt');
    }
  },
  methods: {
    /**
     * Set value line spacing for object text
     * @param   {Any} val value line spacing of text (string or object)
     */
    onChange(data) {
      const check = data.name ? data.name : data;
      const isAuto = check.toLowerCase() === 'auto';

      const { isValid, value } = validateInputOption(
        getValueInput(data),
        1,
        500,
        0,
        this.items,
        'pt'
      );
      const updateData = isValid ? { lineSpacing: isAuto ? 0 : value } : {};
      this.$root.$emit('printChangeTextProperties', updateData);
    }
  }
};
