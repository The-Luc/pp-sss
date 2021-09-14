import PpSelect from '@/components/Selectors/Select';
import Properties from '@/components/Properties/BoxProperties';
import InputTitle from '@/components/Properties/Features/InputTitle';

import { DELAY_OPTION } from '@/common/constants';
import { useFrame, useFrameTitle } from '@/hooks';

export default {
  components: {
    PpSelect,
    Properties,
    InputTitle
  },
  setup() {
    const { currentFrame } = useFrame();
    const { setFrameTitle } = useFrameTitle();

    return {
      currentFrame,
      setFrameTitle
    };
  },
  data() {
    return {
      delayOpts: DELAY_OPTION,
      componentKey: true
    };
  },
  computed: {
    frameTitle() {
      return this.currentFrame?.frameTitle || '';
    }
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
     * @param   {String}  value Value user input
     */
    onChangeTitle(value) {
      this.setFrameTitle({ value });
    }
  }
};
