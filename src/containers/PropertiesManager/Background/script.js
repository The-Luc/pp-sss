import Properties from '@/components/Properties/BoxProperties';
import OpacityProp from '@/components/Properties/Features/Opacity';
import FlipProp from '@/components/Properties/Features/Flip';
import Remove from './Remove';

import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/book/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';

export default {
  components: {
    Properties,
    OpacityProp,
    FlipProp,
    Remove
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      selectedOpacity: PRINT_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: PRINT_GETTERS.TRIGGER_BACKGROUND_CHANGE
    }),
    selectedOpacityValue() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const opacity = this.selectedOpacity('opacity');

      return opacity || 0;
    }
  },
  methods: {
    /**
     * Fire when opacity is changed from opacity component
     *
     * @param {Number}  opacity - the opacity data
     */
    onChangeOpacity(opacity) {
      this.$root.$emit('printChangeBackgroundProperties', { opacity });
    }
  }
};
