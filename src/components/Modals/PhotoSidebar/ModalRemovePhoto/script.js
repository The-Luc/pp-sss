import PpButton from '@/components/Buttons/Button';

export default {
  components: {
    PpButton
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    modalType() {
      return this.type === 'Photos' ? 'photo' : 'media';
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
