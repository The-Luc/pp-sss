import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';
import { isEmpty, sortByProperty } from '@/common/utils';

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

      //re-order frame ids
      const indexOfIds = this.selectedFrames.map(id => ({
        id,
        index: this.frameIds.findIndex(frameId => frameId === id)
      }));

      const ids = sortByProperty(indexOfIds, 'index').map(f => f.id);

      this.$emit('onChooseFrames', ids);
    }
  }
};
