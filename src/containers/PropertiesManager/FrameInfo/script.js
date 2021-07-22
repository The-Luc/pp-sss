import PpSelect from '@/components/Selectors/Select';
import Properties from '@/components/Properties/BoxProperties';
import InputTitle from '@/components/inputTitle';

import { DEPLAY_OPTION } from '@/common/constants';

export default {
  components: {
    PpSelect,
    Properties,
    InputTitle
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
    },
    /**
     * set value title change
     * @param   {String}  title Value user input
     */
    onChangeTitle(val) {
      console.log(val);
    }
  }
};
