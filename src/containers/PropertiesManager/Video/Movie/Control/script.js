import { useElementProperties } from '@/hooks';

import { EVENT_TYPE } from '@/common/constants';
import { isEmpty } from '@/common/utils';

export default {
  components: {},
  data() {
    return {};
  },
  setup() {
    const { getProperty } = useElementProperties();

    return { getProperty };
  },
  computed: {
    isPlaying() {
      const isPlaying = this.getProperty('isPlaying');

      return isEmpty(isPlaying) ? false : isPlaying;
    }
  },
  methods: {
    /**
     * Fire when rewind button is clicked
     */
    onRewind() {
      // handle event
      console.log('rewind');
    },
    onKeepRewind() {
      // handle event
      console.log('keep rewind');
    },
    onStopKeepRewind() {
      // handle event
      console.log('stop keep rewind');
    },
    /**
     * Fire when play button is clicked
     */
    onTogglePlay() {
      this.$root.$emit(EVENT_TYPE.VIDEO_TOGGLE_PLAY);
    },
    /**
     * Fire when fast-forward button is clicked
     */
    onFastForward() {
      // handle event
      console.log('fast-forward');
    },
    onKeepForward() {
      // handle event
      console.log('keep forward');
    },
    onStopKeepForward() {
      // handle event
      console.log('stop keep forward');
    }
  }
};
