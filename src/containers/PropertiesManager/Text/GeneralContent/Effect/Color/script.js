import { mapGetters, mapMutations } from 'vuex';

import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';

export default {
  mounted() {
    this.$root.$on('colorChange', color => {
      this.$root.$emit('printChangeTextProperties', { color: color });
    });
  },
  computed: {
    ...mapGetters({
      isOpenColorPicker: GETTERS.IS_OPEN_COLOR_PICKER,
      selectedId: BOOK_GETTERS.SELECTED_OBJECT_ID,
      selectedColor: BOOK_GETTERS.PROP_OBJECT_BY_ID,
      triggerChange: BOOK_GETTERS.TRIGGER_OBJECT_CHANGE
    }),
    color() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const color =
        this.selectedColor({ id: this.selectedId, prop: 'color' }) || '#0B1717';

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
