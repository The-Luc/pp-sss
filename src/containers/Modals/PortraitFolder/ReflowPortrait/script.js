import PpButton from '@/components/Buttons/Button';
import CommonModal from '@/components/Modals/CommonModal';

export default {
  components: {
    CommonModal,
    PpButton
  },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    },
    flowedFolders: {
      type: Array,
      default: []
    }
  },
  methods: {
    /**
     * Emit apply event to parent
     */
    onApply() {
      this.$emit('apply');
    },
    /**
     * Emit cancel event to parent
     */
    onCancel() {
      this.$emit('cancel');
    }
  }
};
