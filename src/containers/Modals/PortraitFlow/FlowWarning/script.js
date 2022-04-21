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
    },
    isShowFisrtTime: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    /**
     * Continue setting
     */
    onContinue() {
      this.$emit('continue');
    },
    /**
     * Close modal
     */
    onCancel() {
      this.$emit('cancel');
    }
  }
};
