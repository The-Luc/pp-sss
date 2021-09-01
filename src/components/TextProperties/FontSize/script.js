import PpCombobox from '@/components/Selectors/Combobox';

import { getValueInput, validateInputOption } from '@/common/utils';
import { ICON_LOCAL, FONT_SIZE } from '@/common/constants';

export default {
  components: {
    PpCombobox
  },
  props: {
    nudgeWidth: {
      type: Number,
      default: 76
    },
    selectedSize: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      componentKey: true,
      fontSize: FONT_SIZE,
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      prependedIcon: ICON_LOCAL.PREPENDED_FONT_SIZE
    };
  },
  methods: {
    /**
     * Emit to back value to parent
     * @param {Any} data size of text (string or object)
     */
    onChange(data) {
      const { isValid, value } = validateInputOption(
        getValueInput(data),
        1,
        500,
        0,
        this.fontSize,
        'pt'
      );

      if (!isValid) {
        this.forceRenderComponent();
        return;
      }
      this.$emit('change', value);
    },
    /**
     * Trigger render component by changing component key
     */
    forceRenderComponent() {
      this.componentKey = !this.componentKey;
    }
  }
};
