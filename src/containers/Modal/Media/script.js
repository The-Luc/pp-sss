import Footer from '@/components/ModalMediaSelection/Footer';
import Smartbox from '@/components/ModalMediaSelection/Smartbox';
import TabSearch from '@/components/ModalMediaSelection/TabSearch';

import { useGetterDigitalSheet, useFrame } from '@/hooks';
import { usePhotos } from '@/views/CreateBook/composables';
import { useGetMedia } from '@/views/CreateBook/DigitalEdition/EditScreen/composables';

import {
  insertItemsToArray,
  removeItemsFormArray,
  getUniqueKeywords
} from '@/common/utils';

export default {
  components: {
    Footer,
    Smartbox,
    TabSearch
  },
  setup() {
    const { currentSection } = useGetterDigitalSheet();
    const { currentFrame } = useFrame();
    const { isPhotoVisited, updatePhotoVisited } = usePhotos();
    const { getSmartboxMedia, getSearchMedia } = useGetMedia();

    return {
      isPhotoVisited,
      updatePhotoVisited,
      currentSection,
      currentFrame,
      getSmartboxMedia,
      getSearchMedia
    };
  },
  data() {
    return {
      selectedMedia: [],
      currentTab: '',
      defaultTab: 'smartbox',
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
      this.photos = await this.getSmartboxMedia(keywords);
    }
  },
  computed: {
    isShowFooter() {
      return this.currentTab !== 'add';
    },
    isNoSelectMedia() {
      return this.selectedMedia.length === 0;
    }
  },
  methods: {
    /**
     * Emit select event to parent
     */
    onSelect() {
      this.$emit('select', this.selectedMedia);
      this.onCancel();
    },
    /**
     * Emit cancel event to parent
     */
    onCancel() {
      this.$emit('cancel');
      this.selectedMedia = [];
      this.defaultTab = null;
    },
    /**
     * Event change tab of modal photo
     * @param   {String}  tab  current tab
     */
    async onChangeTab(tab) {
      if (this.currentTab === tab) return;
      this.currentTab = tab;

      this.selectedMedia = [];
      this.photos = [];

      if (this.currentTab === 'smartbox') {
        this.getListKeywords();
        const keywords = this.keywords.map(keyword => keyword.value);
        this.photos = await this.getSmartboxMedia(keywords);
      }
    },
    /**
     * Selected a image and push or remove in array image selected
     * @param   {Object}  image  id of current book
     */
    onSelectedMedia(image) {
      const index = this.selectedMedia.findIndex(item => item.id === image.id);

      if (index < 0) {
        this.selectedMedia = insertItemsToArray(this.selectedMedia, [
          { value: image }
        ]);
      } else {
        this.selectedMedia = removeItemsFormArray(this.selectedMedia, [
          { value: image, index }
        ]);
      }
    },
    /**
     * Get list keyword from section name and frame title
     */
    getListKeywords() {
      this.keywords = getUniqueKeywords([
        this.currentFrame.frameTitle,
        this.currentSection.name
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

      this.photos = await this.getSmartboxMedia(activeKeywords);
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
      this.photos = await this.getSearchMedia(input);
    }
  }
};
