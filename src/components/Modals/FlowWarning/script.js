import PpButton from '@/components/Buttons/Button';

export default {
  components: { PpButton },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    },
    descriptModal: {
      type: String,
      required: true
    }
  },
  methods: {
    /**
     * Close modal
     */
    onClose() {
      this.$emit('close');
    }
  }
};
