import { mapGetters, mapMutations } from 'vuex';

import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';

export default {
  mounted() {
    this.$root.$on('colorChange', color => {
      this.$root.$emit('printChangeTextProperties', { color: color });
    });
    this.$root.$on('borderChange', color => {
      this.$root.$emit('printChangeTextProperties', {
        border: {
          stroke: color
        }
      });
    });
  },
  computed: {
    ...mapGetters({
      isOpenColorPicker: GETTERS.IS_OPEN_COLOR_PICKER,
      selectedId: BOOK_GETTERS.SELECTED_OBJECT_ID,
      selectedColor: BOOK_GETTERS.PROP_OBJECT_BY_ID,
      triggerChange: BOOK_GETTERS.TRIGGER_TEXT_CHANGE,
      colorPickerProps: GETTERS.COLOR_PICKER_CUSTOM_PROPS
    }),
    color() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      let color = '#0B1717';
      if (this.colorPickerProps.tabActive === 'general') {
        color =
          this.selectedColor({ id: this.selectedId, prop: 'color' }) ||
          '#0B1717';
        this.setColorPickerColor({ color: color });
      }

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
      if (!this.isOpenColorPicker) {
        this.toggleColorPicker({
          isOpen: !this.isOpenColorPicker,
          data: {
            eventName: 'colorChange',
            color: this.color
          }
        });
      }
    }
  }
};
