import { mapGetters } from 'vuex';

import Opacity from '@/components/Property/Opacity';
import Border from './Border';
import Shadow from './Shadow';
import { GETTERS } from '@/store/modules/book/const';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
export default {
  components: {
    Opacity,
    Border,
    Shadow
  },
  props: {
    borderOptions: {
      type: Array,
      required: true
    },
    selectedBorder: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      selectedColor: GETTERS.PROP_OBJECT_BY_ID,
      colorPickerProps: APP_GETTERS.COLOR_PICKER_CUSTOM_PROPS,
      selectedId: GETTERS.SELECTED_OBJECT_ID,
      selectedOpacity: GETTERS.PROP_OBJECT_BY_ID,
      triggerChange: GETTERS.TRIGGER_TEXT_CHANGE
    }),
    opacityValue() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const res = this.selectedOpacity({
        id: this.selectedId,
        prop: 'opacity'
      });
      return !res ? 0 : res;
    }
  },
  methods: {
    /**
     * Receive value opacity from children
     * @param   {Number}  opacity Value user input
     */
    onChangeOpacity(opacity) {
      this.$root.$emit('printChangeTextProperties', { opacity });
    },
    /**
     * Receive value border from children
     * @param   {Object}  data Value user selecte
     */
    onChangeBorder(data) {
      this.$emit('changeBorderOption', data);
    },
    /**
     * Receive value shadow from children
     * @param   {Object}  value Value user selecte
     */
    onChangeShadow(value) {
      this.selectedShadow = value;
    }
  }
};
