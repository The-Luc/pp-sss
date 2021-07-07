import { mapGetters } from 'vuex';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import ColorPicker from '@/containers/ColorPicker';
import { DEFAULT_TEXT } from '@/common/constants';
import { EVENT_TYPE } from '@/common/constants/eventType';

export default {
  components: {
    ColorPicker
  },
  computed: {
    ...mapGetters({
      selectedObjectProp: APP_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: APP_GETTERS.TRIGGER_TEXT_CHANGE
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
