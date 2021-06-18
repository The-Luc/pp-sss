import { mapGetters, mapMutations } from 'vuex';

import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import Color from '@/containers/Color';

export default {
  components: {
    Color
  },
  computed: {
    ...mapGetters({
      isOpenColorPicker: GETTERS.IS_OPEN_COLOR_PICKER,
      selectedColor: PRINT_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: PRINT_GETTERS.TRIGGER_TEXT_CHANGE,
      colorPickerProps: GETTERS.COLOR_PICKER_CUSTOM_PROPS
    }),
    color() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      let color = '#0B1717';
      if (this.colorPickerProps.tabActive === 'general') {
        color = this.selectedColor('color') || '#0B1717';

        this.setColorPickerColor({ color: color });
      }

      return color;
    }
  },
  methods: {
    ...mapMutations({
      setColorPickerColor: MUTATES.SET_COLOR_PICKER_COLOR
    }),
    /**
     * Callback function to get color and emit to text properties
     * @param {String} color Color value
     */
    onChange(color) {
      this.$root.$emit('printChangeTextProperties', { color });
    }
  }
};
