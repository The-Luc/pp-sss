import Footer from '@/components/ModalMediaSelection/Footer';
import Photos from './Photos';
import Smartbox from '@/components/ModalMediaSelection/Smartbox';
import TabAddPhotos from './TabAddPhotos';
import TabSearchPhotos from '@/components/ModalMediaSelection/TabSearch';

import { useGetterPrintSheet, useSheet, useAppCommon } from '@/hooks';
import { usePhotos } from '@/views/CreateBook/composables';
import { getPhotos, searchPhotos } from '@/api/photo';

import {
  insertItemsToArray,
  removeItemsFormArray,
  listKeywords
} from '@/common/utils';

export default {
  components: {
    Footer,
    Photos,
    Smartbox,
    TabAddPhotos,
    TabSearchPhotos
  },
  setup() {
    const { currentSection } = useGetterPrintSheet();
    const { currentSheet } = useSheet();
    const { isPhotoVisited, updatePhotoVisited } = usePhotos();
    const { generalInfo } = useAppCommon();

    return {
      isPhotoVisited,
      updatePhotoVisited,
      currentSection,
      currentSheet,
      generalInfo
    };
  },
  data() {
    return {
      selectedImages: [],
      currentTab: '',
      defaultTab: 'smart-box',
      keywords: [],
      photos: []
    };
  },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    async isOpenModal(val) {
      if (!val) return;

      this.getListKeywords();
      const keywords = this.keywords.map(keyword => keyword.value);
      this.photos = await getPhotos(keywords);
    }
  },
  computed: {
    isMediaAdditionalDisplayed() {
      return this.currentTab === 'add';
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
      this.defaultTab = null;
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
      this.onCancel();
    },

    /**
     * Get list keyword from section name, left, right, spread title
     */
    getListKeywords() {
      const { leftTitle, rightTitle } = this.currentSheet.spreadInfo;
      const projectTitle =
        this.currentSection.name === 'Cover' ? this.generalInfo.title : '';

      this.keywords = listKeywords([
        leftTitle,
        rightTitle,
        this.currentSection.name,
        projectTitle
      ]);
    },
    /**
     * Set status active of keyword when click
     */
    async onClickKeyword(val) {
      val.active = !val.active;
      const activeKeywords = this.keywords.reduce((arr, keyword) => {
        if (keyword.active) {
          arr.push(keyword.value);
        }
        return arr;
      }, []);
      this.photos = await getPhotos(activeKeywords);
    },
    /**
     * Trigger mutation set photo visited true for current book
     */
    onClickGotIt() {
      this.updatePhotoVisited({ isPhotoVisited: true });
    },
    /**
     * To search base on value input
     * @param {String}  input value to search
     */
    async onSearch(input) {
      this.photos = await searchPhotos(input);
    }
  }
};
