import Modal from '@/containers/Modal';
import Footer from './Footer';
import Photos from './Photos';
import Smartbox from './Smartbox';
import { modifyItems } from '@/common/utils';
import { MODIFICATION } from '@/common/constants';

export default {
  components: {
    Modal,
    Footer,
    Photos,
    Smartbox
  },
  data() {
    return {
      selectedImages: []
    };
  },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * Emit select event to parent
     */
    onSelect() {
      this.$emit('select', this.selectedImages);
      this.onCancel();
    },
    /**
     * Emit cancel event to parent
     */
    onCancel() {
      this.$emit('cancel');
      this.selectedImages = [];
    },
    /**
     * Selected a image and push or remove in array image selected
     * @param   {Object}  image  id of current book
     */
    onSelectedImage(image) {
      const index = this.selectedImages.findIndex(item => item.id === image.id);

      const modification = index < 0 ? MODIFICATION.ADD : MODIFICATION.DELETE;

      this.selectedImages = modifyItems(
        this.selectedImages,
        image,
        index,
        modification
      );
    },
    /**
     * Event change tab of modal photo
     */
    onChangeTab() {
      this.selectedImages = [];
    }
  }
};
