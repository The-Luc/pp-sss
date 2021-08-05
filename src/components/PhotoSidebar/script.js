import PhotoContent from './PhotoContent';
import ModalAddPhotos from '@/containers/Modal/Photos';

export default {
  components: {
    PhotoContent,
    ModalAddPhotos
  },
  data() {
    return {
      isOpenModal: false
    };
  },
  props: {
    isShowAutoflow: {
      type: Boolean,
      default: false
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
      this.isOpenModal = true;
    },
    /**
     * Add photos on selected
     */
    onSelect(images) {
      this.$emit('selectedImages', images);
    },
    /**
     * Close modal when cancel button
     */
    onCancel() {
      this.isOpenModal = false;
    },
    /**
     * Add photos to canvas by autoflow
     */
    autoflowPhotos() {
      this.$emit('autoflow');
    }
  }
};
