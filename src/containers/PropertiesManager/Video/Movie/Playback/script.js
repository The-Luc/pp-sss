import {
  PLAYBACK_OPTIONS,
  REPEAT_OPTIONS
} from '@/common/constants/videoAnimation';
import Select from '@/components/Selectors/Select';

export default {
  components: { Select },
  data() {
    return {
      playbackOptions: PLAYBACK_OPTIONS,
      repeatOptions: REPEAT_OPTIONS
    };
  },
  computed: {
    selectedPlayback() {
      return this.playbackOptions[0];
    },
    selectedRepeat() {
      return this.repeatOptions[0];
    }
  },
  methods: {
    /**
     * Fire when user change playback select box
     * @param {Object} val Playback options
     */
    onChangePlayback(val) {
      console.log('play back ' + val);
    },
    /**
     * Fire when user change repeat select box
     * @param {Object} val A repeat options
     */
    onChangeRepeat(val) {
      console.log('repeat ' + val);
    }
  }
};
