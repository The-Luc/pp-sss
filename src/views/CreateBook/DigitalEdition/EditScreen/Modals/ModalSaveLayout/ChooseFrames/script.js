import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    Modal,
    PpButton
  },
  props: {
    frameIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedFrames: []
    };
  },
  computed: {
    isDisabledNextBtn() {
      return isEmpty(this.selectedFrames) || this.selectedFrames.length > 4;
    }
  },

  methods: {
    /**
     * Emit event save layout and close modal
     */
    onNext() {
      if (this.isDisabledNextBtn) return;
      this.$emit('onChooseFrames', this.selectedFrames);
    }
  }
};
