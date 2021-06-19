import { mapGetters, mapMutations } from 'vuex';

import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import Color from '@/containers/Color';

export default {
  components: {
    Color
  },
  computed: {
    ...mapGetters({
      triggerChange: PRINT_GETTERS.TRIGGER_TEXT_CHANGE,
      selectedColor: PRINT_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      colorPickerProps: GETTERS.COLOR_PICKER_CUSTOM_PROPS
    }),
    borderColor() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const isTabStyle = this.colorPickerProps.tabActive === 'style';
      const border = isTabStyle ? this.selectedColor('border') : {};
      if (isTabStyle) {
        this.setColorPickerColor({
          color: border?.stroke || '#000000'
        });
      }
      return border?.stroke || '#000000';
    }
  },
  methods: {
    ...mapMutations({
      setColorPickerColor: MUTATES.SET_COLOR_PICKER_COLOR
    }),
    /**
     * Callback function to get bordercolor and emit to text properties
     * @param {String} color Border color value
     */
    onChange(color) {
      this.$root.$emit('printChangeTextProperties', {
        border: {
          stroke: color
        }
      });
    }
  }
};
