import { Mix } from 'vue-color';
import { mapGetters, mapMutations } from 'vuex';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
export default {
  components: {
    Mix
  },
  data() {
    return {
      customClass: 'color-picker-border-text'
    };
  },
  computed: {
    ...mapGetters({
      selectedId: BOOK_GETTERS.SELECTED_OBJECT_ID,
      isOpenColorPicker: GETTERS.IS_OPEN_COLOR_PICKER,
      triggerChange: BOOK_GETTERS.TRIGGER_OBJECT_CHANGE,
      selectedColor: BOOK_GETTERS.PROP_OBJECT_BY_ID
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
     * Triggers mutation to toggle color picker popover and custom class
     */
    onOpenColorPicker() {
      this.toggleColorPicker({
        isOpen: !this.isOpenColorPicker,
        data: {
          color: this.color,
          customClass: this.customClass
        }
      });
    }
  },
  mounted() {
    this.$root.$on('colorChange', color => {});
  }
};
