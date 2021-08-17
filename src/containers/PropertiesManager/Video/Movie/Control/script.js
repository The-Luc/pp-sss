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
      // handle event
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
