import Background from './Background';
import ImageReset from './ImageReset';
export default {
  components: {
    ImageReset,
    Background
  },
  methods: {
    /**
     * Emit click crop image event to parent component
     */
    onClickCropImage() {
      this.$emit('onClickCropImage');
    },
    /**
     * Emit click remove image event to parent component
     */
    onClickRemoveImage() {
      this.$emit('onClickRemoveImage');
    },
    /**
     * Emit click background image event to parent component
     */
    onClickBackgroundImage() {
      this.$emit('onClickBackgroundImage');
    }
  }
};
