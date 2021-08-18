import Footer from '@/components/ModalMediaSelection/Footer';
import TabAddPhotos from '@/components/ModalMediaSelection/TabAddPhotos';
import Smartbox from '@/components/ModalMediaSelection/Smartbox';
import TabPhotos from '@/components/ModalMediaSelection/TabPhotos';
import TabSearchPhotos from '@/components/ModalMediaSelection/TabSearch';

import { useGetterPrintSheet, useSheet, useAppCommon, usePhoto } from '@/hooks';
import { usePhotos } from '@/views/CreateBook/composables';
import { useGetPhotos } from '@/views/CreateBook/PrintEdition/EditScreen/composables';

import {
  insertItemsToArray,
  removeItemsFormArray,
  getUniqueKeywords
} from '@/common/utils';
import {
  PHOTO_CATEGORIES,
  ALL_PHOTO_SUBCATEGORY_ID,
  IMAGE_TYPES
} from '@/common/constants';

export default {
  components: {
    Footer,
    TabPhotos,
    Smartbox,
    TabAddPhotos,
    TabSearchPhotos
  },
  setup() {
    const { currentSection } = useGetterPrintSheet();
    const { currentSheet } = useSheet();
    const { isPhotoVisited, updatePhotoVisited } = usePhotos();
    const { getSmartboxPhotos, getSearchPhotos } = useGetPhotos();
    const { generalInfo } = useAppCommon();
    const { getAlbums, getPhotoDropdowns } = usePhoto();

    return {
      isPhotoVisited,
      updatePhotoVisited,
      currentSection,
      currentSheet,
      generalInfo,
      getSmartboxPhotos,
      getSearchPhotos,
      getAlbums,
      getPhotoDropdowns
    };
  },
  data() {
    return {
      selectedImages: [],
      currentTab: '',
      defaultTab: 'smartbox',
      keywords: [],
      photos: [],
      selectedType: {
        value: PHOTO_CATEGORIES.COMMUNITIES.value,
        sub: { value: ALL_PHOTO_SUBCATEGORY_ID }
      },
      albums: [],
      photoDropdowns: {},
      mediaTypes: IMAGE_TYPES
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
      this.photos = await this.getSmartboxPhotos(keywords);
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
    async onChangeTab(tab) {
      if (this.currentTab === tab) return;
      this.currentTab = tab;

      this.selectedImages = [];
      this.photos = [];

      if (this.currentTab === 'smartbox') {
        this.getListKeywords();
        const keywords = this.keywords.map(keyword => keyword.value);
        this.photos = await this.getSmartboxPhotos(keywords);
      }

      if (this.currentTab !== 'photos') return;

      this.albums = await this.getAlbums();
      this.photoDropdowns = await this.getPhotoDropdowns();
      this.selectedType = {
        value: PHOTO_CATEGORIES.COMMUNITIES.value,
        sub: { value: ALL_PHOTO_SUBCATEGORY_ID }
      };
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

      this.keywords = getUniqueKeywords([
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
      this.photos = await this.getSmartboxPhotos(activeKeywords);
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
      this.photos = await this.getSearchPhotos(input);
    },
    /**
     * Change dropdown type to select a album
     * @param   {Object}  data  type and album selected
     */
    onChangeType(data) {
      this.selectedType = {
        value: data.value,
        sub: {
          value: data.sub.value,
          sub: data.sub.sub?.value
        }
      };
    }
  }
};
