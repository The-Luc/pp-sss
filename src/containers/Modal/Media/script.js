import Footer from '@/components/ModalMediaSelection/Footer';
import TabUploadMedia from '@/components/ModalMediaSelection/TabUploadMedia';
import Smartbox from '@/components/ModalMediaSelection/Smartbox';
import TabMedia from '@/components/ModalMediaSelection/TabMedia';
import TabSearchPhotos from '@/components/ModalMediaSelection/TabSearch';

import {
  useGetterEditionSection,
  useFrame,
  useSheet,
  useAppCommon,
  usePhoto
} from '@/hooks';
import { usePhotos } from '@/views/CreateBook/composables';

import {
  insertItemsToArray,
  removeItemsFormArray,
  getUniqueKeywords
} from '@/common/utils';
import {
  VIDEO_CATEGORIES,
  PHOTO_CATEGORIES,
  ALL_MEDIA_SUBCATEGORY_ID,
  IMAGE_TYPES
} from '@/common/constants';

export default {
  components: {
    Footer,
    TabMedia,
    Smartbox,
    TabUploadMedia,
    TabSearchPhotos
  },
  setup() {
    const { generalInfo } = useAppCommon();
    const { currentSection } = useGetterEditionSection();
    const { currentFrame } = useFrame();
    const { currentSheet } = useSheet();
    const {
      isPhotoVisited,
      updatePhotoVisited,
      getSmartbox,
      getSearch
    } = usePhotos();
    const { getAlbums, getMediaCategories } = usePhoto();

    return {
      isPhotoVisited,
      updatePhotoVisited,
      currentSection,
      currentFrame,
      currentSheet,
      generalInfo,
      getSmartbox,
      getSearch,
      getAlbums,
      getMediaCategories
    };
  },
  data() {
    return {
      selectedMedia: [],
      currentTab: '',
      defaultTab: 'smartbox',
      keywords: [],
      photos: [],
      selectedType: {
        value: PHOTO_CATEGORIES.COMMUNITIES.value,
        sub: { value: ALL_MEDIA_SUBCATEGORY_ID }
      },
      albums: [],
      mediaDropdowns: {},
      mediaTypes: IMAGE_TYPES
    };
  },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    isMediaAdditionalDisplayed() {
      return this.currentTab === 'add';
    },
    isNoSelectMedia() {
      return this.selectedMedia.length === 0;
    },
    isModalMedia() {
      return this.type === 'media';
    }
  },
  watch: {
    async isOpenModal(val) {
      if (!val) return;

      this.getListKeywords();
      const keywords = this.keywords.map(keyword => keyword.value);

      this.photos = await this.getSmartbox(keywords, this.isModalMedia);
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
     * Selected media and push or remove in array media selected
     * @param   {Object}  media  id of current book
     */
    onSelectedMedia(media) {
      const index = this.selectedMedia.findIndex(item => item.id === media.id);

      if (index < 0) {
        this.selectedMedia = insertItemsToArray(this.selectedMedia, [
          { value: media }
        ]);
      } else {
        this.selectedMedia = removeItemsFormArray(this.selectedMedia, [
          { value: media, index }
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

      this.selectedMedia = [];
      this.photos = [];

      if (this.currentTab === 'smartbox') {
        this.getListKeywords();
        const keywords = this.keywords.map(keyword => keyword.value);
        this.photos = await this.getSmartbox(keywords, this.isModalMedia);
      }

      if (this.currentTab !== 'photos' && this.currentTab !== 'videos') return;

      this.albums = await this.getAlbums();
      this.mediaDropdowns = await this.getMediaCategories();
      this.selectedType = {
        value:
          this.currentTab === 'photos'
            ? PHOTO_CATEGORIES.COMMUNITIES.value
            : VIDEO_CATEGORIES.COMMUNITIES.value,
        sub: { value: ALL_MEDIA_SUBCATEGORY_ID }
      };
    },
    /**
     * Emit files user upload and emit to parent
     * @param   {Array}  files  files user upload
     */
    onUploadMedia(files) {
      this.$emit('uploadImages', files);
      this.onCancel();
    },

    /**
     * Get list keyword from section name, left, right, spread title
     */
    getListKeywords() {
      if (this.isModalMedia) {
        this.keywords = getUniqueKeywords([
          this.currentFrame.frameTitle,
          this.currentSection.name
        ]);
        return;
      }

      const { leftTitle, rightTitle } = this.currentSheet?.spreadInfo;
      const projectTitle =
        this.currentSection?.name === 'Cover' ? this.generalInfo.title : '';
      this.keywords = getUniqueKeywords([
        leftTitle,
        rightTitle,
        this.currentSection?.name,
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

      this.photos = await this.getSmartbox(activeKeywords, this.isModalMedia);
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
      this.photos = await this.getSearch(input, this.isModalMedia);
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
