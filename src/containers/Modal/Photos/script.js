import Modal from '@/containers/Modal';
import Footer from './Footer';

export default {
  components: {
    Modal,
    Footer
  },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * Emit select event to parent
     */
    onSelect() {
      this.$emit('select');
    },
    /**
     * Emit cancel event to parent
     */
    onCancel() {
      this.$emit('cancel');
    }
  }
};
