import PhotoContent from '@/components/PhotoContent';
import ModalAddPhotos from '@/containers/Modal/Photos';

import { usePhotoSidebar } from '@/views/CreateBook/composables';

export default {
  components: {
    PhotoContent,
    ModalAddPhotos
  },
  setup() {
    const { isOpenPhotoSidebar, togglePhotos } = usePhotoSidebar();

    return {
      isOpenPhotoSidebar,
      togglePhotos
    };
  },
  data() {
    return {
      isOpenModal: false
    };
  },
  methods: {
    /**
     * Close photo content in sidebar
     */
    closePhotoContent() {
      this.togglePhotos();
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
    onSelect() {
      console.log('selected');
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
