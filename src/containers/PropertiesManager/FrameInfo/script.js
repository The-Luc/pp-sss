import PpSelect from '@/components/Selectors/Select';
import Properties from '@/components/Properties/BoxProperties';
import { DEPLAY_OPTION } from '@/common/constants';

export default {
  components: {
    PpSelect,
    Properties
  },
  data() {
    return {
      delayOpts: DEPLAY_OPTION
    };
  },
  methods: {
    /**
     * Fire when delay is changed
     */
    onChangeDelay() {
      // handle here
    }
  }
};
