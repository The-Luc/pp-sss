import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';

export default {
  components: {
    Modal,
    PpButton
  },
  props: {
    header: {
      type: String,
      required: true
    },
    cancelContent: {
      type: String,
      default: 'Cancel'
    },
    actionContent: {
      type: String,
      default: 'Confirm'
    },
    width: {
      type: String,
      default: '424'
    }
  },
  methods: {
    /**
     * Fire when user say yes
     */
    onAction() {
      this.$emit('onAccept');
    },

    /**
     * Close modal when click Cancel
     */
    onCancel() {
      this.$emit('onCancel');
    }
  }
};