import Modal from '@/containers/Modal';
import Footer from './Footer';
import Photos from './Photos';
import TabAddPhotos from './TabAddPhotos';

import { insertItemsToArray, removeItemsFormArray } from '@/common/utils';

export default {
  components: {
    Modal,
    Footer,
    Photos,
    TabAddPhotos
  },
  data() {
    return {
      selectedImages: [],
      currentTab: ''
    };
  },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isShowFooter() {
      return this.currentTab !== 'add';
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

      if (index < 0) {
        this.selectedImages = insertItemsToArray(this.selectedImages, [
          { value: image }
        ]);
      } else {
        this.selectedImages = removeItemsFormArray(this.selectedImages, [
          { value: image, index }
        ]);
      }
    },
    /**
     * Event change tab of modal photo
     * @param   {String}  tag  current tag
     */
    onChangeTab(tab) {
      this.currentTab = tab;
      this.selectedImages = [];
    },
    /**
     * Emit files user upload and emit to parent
     * @param   {Array}  files  files user upload
     */
    onUploadImages(files) {
      this.$emit('uploadImages', files);
    }
  }
};
