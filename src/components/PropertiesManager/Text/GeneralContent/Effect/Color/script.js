import { mapGetters, mapMutations } from 'vuex';

import { GETTERS, MUTATES } from '@/store/modules/app/const';
import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';

export default {
  mounted() {
    this.$root.$on('colorChange', color => {
      this.setTextStyle({
        color: color
      });

      this.$root.$emit('printChangeTextProp', { fill: color });
    });
  },
  computed: {
    ...mapGetters({
      isOpenColorPicker: GETTERS.IS_OPEN_COLOR_PICKER
    }),
    color() {
      const color = this.getTextStyle().color || '#0B1717';

      this.setColorPickerColor({ color: color });

      return color;
    }
  },
  methods: {
    ...mapGetters({
      getTextStyle: PRINT_GETTERS.TEXT_STYLE
    }),
    ...mapMutations({
      toggleColorPicker: MUTATES.TOGGLE_COLOR_PICKER,
      setTextStyle: PRINT_MUTATES.SET_TEXT_STYLE,
      setColorPickerColor: MUTATES.SET_COLOR_PICKER_COLOR
    }),
    /**
     * Triggers mutation to toggle color picker popover
     */
    onOpenColorPicker() {
      this.toggleColorPicker({
        isOpen: !this.isOpenColorPicker,
        data: {
          color: this.color
        }
      });
    }
  }
};
