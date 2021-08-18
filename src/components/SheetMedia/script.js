import Draggable from 'vuedraggable';
import ModalRemovePhoto from './ModalRemovePhoto';
import { ASSET_TYPE } from '@/common/constants';

export default {
  components: {
    Draggable,
    ModalRemovePhoto
  },
  props: {
    media: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showRemoveModal: false,
      selectedItem: null
    };
  },
  methods: {
    /**
     * Hanlde open confirm modal after click remove icon
     * @param {Object} photo photo will be removed
     */
    onShowRemoveModal(photo) {
      this.selectedItem = photo;
      this.showRemoveModal = true;
    },

    /**
     * Trigger when click remove button
     */
    onRemove() {
      this.$emit('remove', this.selectedItem);
      this.onCancel();
    },

    /**
     * Trigger when click cancel button
     */
    onCancel() {
      this.selectedItem = null;
      this.showRemoveModal = false;
    },

    /**
     * Trigger when start drag item
     * @param {Object} event Event trigger when start drag item
     */
    onChoose(event) {
      const { offsetX, offsetY } = event.originalEvent;

      this.selectedItem = this.media[event.oldIndex];

      this.selectedItem.offsetX = offsetX;
      this.selectedItem.offsetY = offsetY;

      this.$emit('drag', this.selectedItem);
    },

    /**
     * Trigger when stop drag item
     */
    onUnchoose() {
      this.selectedItem = null;
    },
    /**
     * Check asset is video
     */
    isVideo(type) {
      return type === ASSET_TYPE.VIDEO;
    },
    /**
     * Check asset is compositon
     */
    isComposition(type) {
      return type === ASSET_TYPE.COMPOSITION;
    }
  }
};
