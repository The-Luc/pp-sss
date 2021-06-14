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
      triggerChange: BOOK_GETTERS.TRIGGER_TEXT_CHANGE,
      selectedColor: BOOK_GETTERS.PROP_OBJECT_BY_ID,
      colorPickerProps: GETTERS.COLOR_PICKER_CUSTOM_PROPS
    }),
    borderColor() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const isTabStyle = this.colorPickerProps.tabActive === 'style';
      const border = isTabStyle
        ? this.selectedColor({ id: this.selectedId, prop: 'border' })
        : {};
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
      setColorPickerColor: MUTATES.SET_COLOR_PICKER_COLOR,
      toggleColorPicker: MUTATES.TOGGLE_COLOR_PICKER
    }),
    onOpenColorPicker() {
      if (!this.isOpenColorPicker) {
        this.toggleColorPicker({
          isOpen: !this.isOpenColorPicker,
          data: {
            eventName: 'borderChange',
            color: this.borderColor,
            customClass: this.customClass
          }
        });
      }
    }
  }
};
