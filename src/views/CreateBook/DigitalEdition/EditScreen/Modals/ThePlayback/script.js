import Playback from '@/components/Playback';

import ThePreview from '../ThePreview';

export default {
  components: {
    ThePreview,
    Playback
  },
  props: {
    canvasSize: {
      type: Object,
      required: true
    },
    playbackData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    /**
     * Emit close event to parent
     */
    onClose() {
      this.$emit('close');
    }
  }
};
