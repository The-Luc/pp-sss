import {
  PLAYBACK_OPTIONS,
  REPEAT_OPTIONS
} from '@/common/constants/videoProperty';
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
    onChangePlayback(val) {
      console.log('play back ' + val);
      //
    },
    onChangeRepeat(val) {
      console.log('repeat ' + val);
      //
    }
  }
};
