import { mapGetters } from 'vuex';

import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import ColorPicker from '@/containers/ColorPicker';
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
    borderColor() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      return this.selectedObjectProp('border')?.stroke || '#000000';
    }
  },
  methods: {
    /**
     * Callback function to get bordercolor and emit to text properties
     * @param {String} color Border color value
     */
    onChange(color) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        border: {
          stroke: color
        }
      });
    }
  }
};
