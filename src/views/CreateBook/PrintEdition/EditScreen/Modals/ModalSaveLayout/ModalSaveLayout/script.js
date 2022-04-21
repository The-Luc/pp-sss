import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';
import { useModal } from '@/hooks';
import { EVENT_TYPE } from '@/common/constants';
export default {
  components: {
    Modal,
    PpButton
  },
  setup() {
    const { toggleModal } = useModal();
    return { toggleModal };
  },
  data() {
    return {
      layoutName: ''
    };
  },
  computed: {
    id() {
      return this.$attrs.props.id;
    },
    type() {
      return this.$attrs.props.type;
    }
  },
  methods: {
    /**
     * Trigger mutation to close modal
     */
    onCancel() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    /**
     * Emit event save layout and close modal
     */
    saveLayout() {
      this.$root.$emit(EVENT_TYPE.SAVE_LAYOUT, {
        layoutName: this.layoutName?.trim() || 'Untitled',
        id: this.id,
        type: this.type
      });
      this.onCancel();
    }
  }
};
