import Draggable from 'vuedraggable';
import PhotoContent from './PhotoContent';
import ModalRemovePhoto from './ModalRemovePhoto';
import { ASSET_TYPE } from '@/common/constants';

export default {
  components: {
    Draggable,
    PhotoContent,
    ModalRemovePhoto
  },
  props: {
    isShowAutoflow: {
      type: Boolean,
      default: false
    },
    mediaType: {
      type: String,
      required: true
    },
    disabledAutoflow: {
      type: Boolean,
      default: false
    },
    media: {
      type: Array,
      default: () => []
    },
    isMediaSidebarOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showRemoveModal: false,
      selectedItem: null
    };
  },
  watch: {
    isMediaSidebarOpen(val) {
      if (val) return;

      this.$refs.mediaContainer.scrollTop = 0;
    }
  },
  methods: {
    /**
     * Close photo content in sidebar
     */
    closePhotoContent() {
      this.$emit('closePhotoSidebar');
    },
    /**
     * Use to open modal add photos
     */
    openModalAddPhoto() {
      this.$emit('click');
    },
    /**
     * Add photos to canvas by autoflow
     */
    autoflowPhotos() {
      this.$emit('autoflow');
    },
    /**
     * Hanlde open confirm modal after click remove icon
     * @param {Object} photo photo will be removed
     */
    onShowRemoveModal(photo) {
      this.selectedItem = photo;
      this.showRemoveModal = true;
    },
    /**
     * Trigger when click cancel button
     */
    onCancel() {
      this.selectedItem = null;
      this.showRemoveModal = false;
    },
    /**
     * Trigger when click remove button
     */
    onRemove() {
      this.$emit('remove', this.selectedItem);
      this.onCancel();
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
