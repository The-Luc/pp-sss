import PpButton from '@/components/Buttons/Button';
export default {
  components: {
    PpButton
  },
  methods: {
    /**
     * Emit click background image event to parent component
     */
    onClickBackgroundImage() {
      this.$emit('onClickBackgroundImage');
    }
  }
};
