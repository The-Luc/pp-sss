import PpSelect from '@/components/Selectors/Select';
import Properties from '@/components/Properties/BoxProperties';
import InputTitle from '@/components/InputTitle';

import { DEPLAY_OPTION } from '@/common/constants';
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
      delayOpts: DEPLAY_OPTION,
      componentKey: true,
      frameTitle: ''
    };
  },
  watch: {
    currentFrame(val, oldVal) {
      if (val.frameTitle !== oldVal.frameTitle) {
        this.frameTitle = val.frameTitle;
        this.componentKey = !this.componentKey;
      }
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
