import PhotoContent from './PhotoContent';
import ModalAddPhotos from '@/containers/Modal/Photos';
import ModalAddMedia from '@/containers/Modal/AddMedia';

export default {
  components: {
    PhotoContent,
    ModalAddPhotos,
    ModalAddMedia
  },
  data() {
    return {
      isOpenModal: false,
      isOpenModalAddMedia: false,
      files: []
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
    },
    /**
     * Close modal photos and open modal add media
     * @param   {Array}  files  files user upload
     */
    onUploadImages(files) {
      this.onCancel();
      this.files = files;
      this.isOpenModalAddMedia = true;
    },
    /**
     * Close modal add media
     */
    onCancelAddMedia() {
      this.isOpenModalAddMedia = false;
    }
  }
};
