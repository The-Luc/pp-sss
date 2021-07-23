import { mapMutations } from 'vuex';
import { MUTATES as DIGITAL_MUTATES } from '@/store/modules/digital/const';

import PpSelect from '@/components/Selectors/Select';
import Properties from '@/components/Properties/BoxProperties';
import InputTitle from '@/components/inputTitle';

import { DEPLAY_OPTION } from '@/common/constants';
import { useFrame } from '@/hooks';

export default {
  components: {
    PpSelect,
    Properties,
    InputTitle
  },
  setup() {
    const { currentFrame } = useFrame();

    return {
      currentFrame
    };
  },
  data() {
    return {
      delayOpts: DEPLAY_OPTION
    };
  },
  computed: {
    titleFrame() {
      return this.currentFrame?.titleFrame;
    }
  },
  methods: {
    ...mapMutations({
      setTitleFrame: DIGITAL_MUTATES.SET_TITLE_FRAME
    }),
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
      this.setTitleFrame({ value });
    }
  }
};
