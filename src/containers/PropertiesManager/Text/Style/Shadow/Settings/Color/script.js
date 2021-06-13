import { Mix } from 'vue-color';
import { mapGetters, mapMutations } from 'vuex';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
export default {
  components: {
    Mix
  },
  props: {
    color: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      customClass: 'color-picker-shadow-text',
      customEventName: 'textShadowColorChange'
    };
  },
  computed: {
    ...mapGetters({
      selectedId: BOOK_GETTERS.SELECTED_OBJECT_ID,
      isOpenColorPicker: GETTERS.IS_OPEN_COLOR_PICKER,
      triggerChange: BOOK_GETTERS.TRIGGER_TEXT_CHANGE
    })
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
          eventName: 'textShadowColorChange',
          color: this.color,
          customClass: this.customClass
        }
      });
    },
    onColorChanged(color) {
      this.$emit('change', color);
    }
  },
  mounted() {
    this.$root.$on(this.customEventName, this.onColorChanged);
  },
  beforeDestroy() {
    this.$root.$off(this.customEventName, this.onColorChanged);
  }
};
