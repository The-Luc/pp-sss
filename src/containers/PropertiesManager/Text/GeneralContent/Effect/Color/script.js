import { mapGetters } from 'vuex';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import ColorPicker from '@/containers/ColorPicker';
import { DEFAULT_TEXT } from '@/common/constants';
import { EVENT_TYPE } from '@/common/constants/eventType';

export default {
  components: {
    ColorPicker
  },
  computed: {
    ...mapGetters({
      selectedObjectProp: PRINT_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: PRINT_GETTERS.TRIGGER_TEXT_CHANGE
    }),
    color() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      return this.selectedObjectProp('color') || DEFAULT_TEXT.COLOR;
    }
  },
  methods: {
    /**
     * Callback function to get color and emit to text properties
     * @param {String} color Color value
     */
    onChange(color) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, { color });
    }
  }
};
