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
      selectedOpacity: GETTERS.PROP_OBJECT_BY_ID
    }),
    selectedOpacity() {
      return 100;
    }
  },
  methods: {
    /**
     * Fire when opacity is changed from child component
     *
     * @param {Number}  data the data from child
     */
    onChangeOpacity(data) {
      this.$root.$emit('printChangeTextProperties', {
        opacity: data / 100
      });
    }
  }
};
