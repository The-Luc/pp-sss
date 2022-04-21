import SpeedControl from './SpeedControl';

import { useElementProperties } from '@/hooks';

import { EVENT_TYPE } from '@/common/constants';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    SpeedControl
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
      this.$root.$emit(EVENT_TYPE.VIDEO_REWIND);
    },
    /**
     * Fire when rewind button is hold
     */
    onKeepRewind() {
      this.$root.$emit(EVENT_TYPE.VIDEO_KEEP_REWIND);
    },
    /**
     * Fire when rewind button is cancel hold
     */
    onStopKeepRewind() {
      this.$root.$emit(EVENT_TYPE.VIDEO_STOP_KEEP_REWIND);
    },
    /**
     * Fire when play button is clicked
     */
    onTogglePlay() {
      this.$root.$emit(EVENT_TYPE.VIDEO_TOGGLE_PLAY);
    },
    /**
     * Fire when forward button is clicked
     */
    onFastForward() {
      this.$root.$emit(EVENT_TYPE.VIDEO_FORWARD);
    },
    /**
     * Fire when forward button is hold
     */
    onKeepForward() {
      this.$root.$emit(EVENT_TYPE.VIDEO_KEEP_FORWARD);
    },
    /**
     * Fire when forward button is cancel hold
     */
    onStopKeepForward() {
      this.$root.$emit(EVENT_TYPE.VIDEO_STOP_KEEP_FORWARD);
    }
  }
};
