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
      customClass: 'color-picker-shadow-text'
    };
  },
  computed: {
    ...mapGetters({
      selectedId: BOOK_GETTERS.SELECTED_OBJECT_ID,
      isOpenColorPicker: GETTERS.IS_OPEN_COLOR_PICKER,
      selectedColor: BOOK_GETTERS.PROP_OBJECT_BY_ID
    }),
    color() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      return '#0B1717';
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
  mounted() {}
};
