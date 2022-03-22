import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';

export default {
  components: {
    Modal,
    PpButton
  },
  data() {
    return {
      layoutName: ''
    };
  },
  methods: {
    /**
     * Emit event save layout and close modal
     */
    saveLayout() {
      const layoutName = this.layoutName?.trim() || 'Untitled';
      this.$emit('save', layoutName);
    }
  }
};
