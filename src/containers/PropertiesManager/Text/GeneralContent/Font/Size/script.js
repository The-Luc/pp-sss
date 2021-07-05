import { mapGetters } from 'vuex';

import PpCombobox from '@/components/Selectors/Combobox';
import { ICON_LOCAL } from '@/common/constants';
import {
  activeCanvas,
  getSelectedOption,
  getValueInput,
  pxToIn,
  validateInputOption
} from '@/common/utils';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
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
  data() {
    return {
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      prependedIcon: ICON_LOCAL.PREPENDED_FONT_SIZE
    };
  },
  computed: {
    ...mapGetters({
      selectedFontSize: PRINT_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: PRINT_GETTERS.TRIGGER_TEXT_CHANGE
    }),
    selectedSize() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const selectedSize = this.selectedFontSize('fontSize') || 60;

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

      const activeObj = activeCanvas?.getActiveObject();

      const { x, y } = activeObj?.aCoords?.tl || {};
      const updateData = isValid ? { fontSize: value } : {};

      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, updateData);

      if (x && y) {
        this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
          coord: {
            x: pxToIn(x),
            y: pxToIn(y)
          }
        });
      }
    }
  }
};
