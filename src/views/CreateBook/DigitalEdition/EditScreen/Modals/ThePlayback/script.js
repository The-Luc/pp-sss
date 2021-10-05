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
  methods: {
    /**
     * Emit close event to parent
     */
    onClose() {
      this.$emit('close');
    }
  }
};
