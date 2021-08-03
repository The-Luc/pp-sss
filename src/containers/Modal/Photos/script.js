import Modal from '@/containers/Modal';
import Footer from './Footer';
import Photos from './Photos';

export default {
  components: {
    Modal,
    Footer,
    Photos
  },
  data() {
    return {
      imagesSelected: []
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
      this.$emit('select', this.imagesSelected);
      this.onCancel();
    },
    /**
     * Emit cancel event to parent
     */
    onCancel() {
      this.$emit('cancel');
      this.imagesSelected = [];
    },
    /**
     * Selected a image and push or remove in array image selected
     * @param   {Object}  image  id of current book
     */
    onSelectedImage(image) {
      const index = this.imagesSelected.findIndex(item => item.id === image.id);
      if (index === -1) {
        this.imagesSelected.push(image);
        return;
      }
      this.imagesSelected = [
        ...this.imagesSelected.slice(0, index),
        ...this.imagesSelected.slice(index + 1, this.imagesSelected.length)
      ];
    },
    /**
     * Event change tab of modal photo
     */
    onChangeTab() {
      this.imagesSelected = [];
    }
  }
};
