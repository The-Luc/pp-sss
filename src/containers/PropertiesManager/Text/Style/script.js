import { mapGetters } from 'vuex';

import Opacity from '@/components/Property/Opacity';
import Border from './Border';
import Shadow from './Shadow';

import { GETTERS } from '@/store/modules/book/const';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';

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
      colorPickerProps: APP_GETTERS.COLOR_PICKER_CUSTOM_PROPS,
      selectedOpacity: PRINT_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: PRINT_GETTERS.TRIGGER_TEXT_CHANGE
    }),
    opacityValue() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const res = this.selectedOpacity('opacity');
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
