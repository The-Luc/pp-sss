import Properties from '@/components/Properties';
import OpacityProp from '@/components/Property/Opacity';
import FlipProp from '@/components/Property/Flip';
import Remove from './Remove';

import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/book/const';

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
      selectedId: GETTERS.SELECTED_OBJECT_ID,
      selectedOpacity: GETTERS.PROP_OBJECT_BY_ID,
      triggerChange: GETTERS.TRIGGER_BACKGROUND_CHANGE
    }),
    selectedOpacityValue() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const opacity = this.selectedOpacity({
        id: this.selectedId,
        prop: 'opacity'
      });

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
