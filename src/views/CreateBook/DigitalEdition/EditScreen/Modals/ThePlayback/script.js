import Playback from '@/components/Playback';

import ThePreview from '../ThePreview';

export default {
  components: {
    ThePreview,
    Playback
  },
  props: {
    playbackData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isShowCanvas: false
    };
  },
  methods: {
    /**
     * Emit close event to parent
     */
    onClose() {
      this.$emit('close');
    },
    /**
     * To show canvas when object on canvas are rendered
     */
    onShowCanvas() {
      this.isShowCanvas = true;
    }
  }
};
