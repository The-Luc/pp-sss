import CommonModal from '../CommonModal';

export default {
  components: {
    CommonModal
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    container: {
      type: String
    }
  },
  methods: {
    /**
     * Emit cancel event to parent
     */
    onCancel() {
      this.$emit('cancel');
    },
    /**
     * Emit accept event to parent
     */
    onAccept() {
      this.$emit('accept');
    }
  }
};
