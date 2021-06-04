import { mapGetters, mapMutations } from 'vuex';

import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS as PROP_GETTERS } from '@/store/modules/property/const';

export default {
  mounted() {
    this.$root.$on('colorChange', color => {
      this.$root.$emit('printChangeTextStyle', { color: color });
    });
  },
  computed: {
    ...mapGetters({
      isOpenColorPicker: GETTERS.IS_OPEN_COLOR_PICKER,
      textStyle: PROP_GETTERS.TEXT_STYLE
    }),
    color() {
      const color = this.textStyle.color || '#0B1717';

      this.setColorPickerColor({ color: color });

      return color;
    }
  },
  methods: {
    ...mapMutations({
      toggleColorPicker: MUTATES.TOGGLE_COLOR_PICKER,
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
