import { Mix } from 'vue-color';
import { mapGetters, mapMutations } from 'vuex';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';

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
      isOpenColorPicker: GETTERS.IS_OPEN_COLOR_PICKER,
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
