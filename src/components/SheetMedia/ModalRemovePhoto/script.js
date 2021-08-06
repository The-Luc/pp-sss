import PpButton from '@/components/Buttons/Button';

export default {
  components: {
    PpButton
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * Trigger when click remove button
     */
    onRemove() {
      this.$emit('remove');
    },
    /**
     * Trigger when click cancel button
     */
    onCancel() {
      this.$emit('cancel');
    }
  }
};
