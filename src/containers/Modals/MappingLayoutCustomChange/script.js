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
      default: 'Layout Mapping: Custom Changes'
    },
    actionContent: {
      type: String,
      default: 'Got it!'
    },
    width: {
      type: String,
      default: '550'
    }
  },
  data() {
    return {
      checkbox: false
    };
  },
  methods: {
    /**
     * Fire when user say yes
     */
    onAction() {
      this.$emit('onAccept', this.checkbox);
    }
  }
};
