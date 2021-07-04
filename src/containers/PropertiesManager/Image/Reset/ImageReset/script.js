import PpButton from '@/components/Buttons/Button';
export default {
  components: {
    PpButton
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
    }
  }
};
