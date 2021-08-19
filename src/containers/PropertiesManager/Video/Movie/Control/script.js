import { OBJECT_TYPE } from '@/common/constants';
import { activeCanvas } from '@/common/utils';

export default {
  components: {},
  data() {
    return {
      isPlaying: false
    };
  },
  methods: {
    /**
     * Fire when rewind button is clicked
     */
    onClickRewind() {
      // handle event
      console.log('rewind');
    },
    /**
     * Fire when play button is clicked
     */
    onClickPlay() {
      const target = activeCanvas.getActiveObject();

      if (!target || target.objectType !== OBJECT_TYPE.VIDEO) return;

      if (target.isPlaying) target.pause();
      else target.play();

      this.isPlaying = !this.isPlaying;
      console.log('play / pause');
    },
    /**
     * Fire when fast-forward button is clicked
     */
    onClickFastForward() {
      // handle event
      console.log('fast-forward');
    }
  }
};
