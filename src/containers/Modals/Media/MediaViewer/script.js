import Footer from '@/components/Modals/MediaSelection/Footer';
import TabUploadMedia from '@/components/Modals/MediaSelection/TabUploadMedia';
import Smartbox from '@/components/Modals/MediaSelection/Smartbox';
import TabMedia from '@/components/Modals/MediaSelection/TabMedia';
import TabSearchPhotos from '@/components/Modals/MediaSelection/TabSearch';

import {
  useGetterEditionSection,
  useFrame,
  useSheet,
  useAppCommon,
  useBook
} from '@/hooks';
import { usePhotos } from '@/views/CreateBook/composables';

import {
  insertItemsToArray,
  removeItemsFormArray,
  getUniqueKeywords,
  getFileExtension,
  isEmpty
} from '@/common/utils';
import {
  VIDEO_CATEGORIES,
  PHOTO_CATEGORIES,
  ALL_MEDIA_SUBCATEGORY_ID,
  VIDEO_TYPES,
  SHEET_TYPE
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
      getSmartbox,
      getSearch,
      getCommunityAlbums,
      getAlbumCategory,
      getAlbums,
      getAlbumById,
      getQrrentById
    } = usePhotos();
    const { isPhotoVisited, updatePhotoVisited } = useBook();

    return {
      isPhotoVisited,
      updatePhotoVisited,
      currentSection,
      currentFrame,
      currentSheet,
      generalInfo,
      getSmartbox,
      getSearch,
      getCommunityAlbums,
      getAlbumCategory,
      getAlbums,
      getAlbumById,
      getQrrentById
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
      albums: {},
      mediaDropdowns: {},
      isOnlyVideoUploaded: false,
      selectedAlbums: [],
      currentPage: 1
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
    },
    selectedAlbumId: {
      type: [Number, String],
      default: null
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
    },
    isPosterFrame() {
      return this.type === 'posterFrame';
    }
  },
  watch: {
    isOpenModal(val) {
      if (!val || !this.selectedAlbumId) return;

      this.defaultTab = this.isOnlyVideoUploaded ? 'videos' : 'photos';
      this.onChangeTab(this.defaultTab);
    }
  },
  async mounted() {
    this.getListKeywords();
    const keywords = this.keywords.map(keyword => keyword.value);

    this.photos = await this.getSmartbox(keywords, this.isModalMedia);
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
     * @param   {Object}  media selected media
     */
    onSelectedMedia(media) {
      if (this.isPosterFrame) {
        this.selectedMedia = [media];
        return;
      }

      const index = this.selectedMedia.findIndex(
        item => item.id === media.id && item.albumId == media.albumId
      );

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
      this.currentPage = 1;
      this.currentTab = tab;

      this.selectedMedia = [];
      this.photos = [];

      if (this.currentTab === 'smartbox') {
        this.getListKeywords();
        const keywords = this.keywords.map(keyword => keyword.value);
        this.photos = await this.getSmartbox(keywords, this.isModalMedia);
      }

      if (this.currentTab !== 'photos' && this.currentTab !== 'videos') return;

      const albumCategories = await this.getAlbumCategory();
      this.mediaDropdowns = albumCategories;

      this.selectedType = this.getSelectedType();

      if (this.selectedAlbumId) {
        const type = this.selectedType.value;
        this.albums = {
          ...(this.albums || []),
          [type]: await this.getAlbumById(this.selectedAlbumId)
        };

        return;
      }

      this.albums = await this.getCommunityAlbums();
    },

    /**
     * Return a selected album type coresponding to the selected album Id
     * @returns {Object} selected album type
     */
    getSelectedType() {
      if (!this.selectedAlbumId) {
        return {
          value:
            this.currentTab === 'photos'
              ? PHOTO_CATEGORIES.COMMUNITIES.value
              : VIDEO_CATEGORIES.COMMUNITIES.value,
          sub: { value: ALL_MEDIA_SUBCATEGORY_ID }
        };
      }

      // seek for the selected album in MY ALBUM
      const value = PHOTO_CATEGORIES.PERSONAL_ALBUMS.value;
      const isAlbumExisted = this.mediaDropdowns[value].find(
        ab => +ab.id === +this.selectedAlbumId
      );

      const subValue = isAlbumExisted
        ? isAlbumExisted.id
        : ALL_MEDIA_SUBCATEGORY_ID;

      // reset selected album to null
      this.$emit('setAlbumId', isAlbumExisted ? subValue : null);

      return {
        value,
        sub: { value: subValue }
      };
    },
    /**
     * Emit files user upload and emit to parent
     * @param   {Array}  files  files user upload
     */
    onUploadMedia(files) {
      this.isOnlyVideoUploaded = !files.some(el => {
        const type = getFileExtension(el.name);
        return !VIDEO_TYPES.includes(type);
      });
      this.$emit('uploadMedia', files);
    },

    /**
     * Get list keyword from section name, left, right, spread title
     */
    getListKeywords() {
      if (this.isModalMedia || this.isPosterFrame) {
        this.keywords = getUniqueKeywords([
          this.currentFrame?.title,
          this.currentSection?.name
        ]);
        return;
      }

      const { leftTitle, rightTitle } = this.currentSheet?.spreadInfo;
      const projectTitle =
        this.currentSheet?.type === SHEET_TYPE.COVER
          ? this.generalInfo.title
          : '';
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
      this.updatePhotoVisited();
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
    async onChangeType(data) {
      this.currentPage = 1;
      const albums = await this.fetchAlbums(data);

      if (!isEmpty(albums)) this.albums[data.value] = albums;

      this.selectedType = {
        value: data.value,
        sub: {
          value: data.sub.value,
          sub: {
            value: data.sub.sub?.value
          }
        }
      };
    },

    /**
     * To get album based on selected category type
     *
     * @param {Object} data data of selected category type
     */
    async fetchAlbums(data) {
      const containerId = data.sub.value;
      if (isEmpty(containerId)) return;

      const MEDIA_CATEGORIES =
        this.currentTab === 'videos' ? VIDEO_CATEGORIES : PHOTO_CATEGORIES;

      let albums;
      if (containerId !== ALL_MEDIA_SUBCATEGORY_ID) {
        albums =
          data.value === 'groups'
            ? await this.getQrrentById(containerId)
            : await this.getAlbumById(containerId);
      } else {
        // fetch all albums of a category (user or community)
        albums = await this.getAlbums(MEDIA_CATEGORIES, data.value);
      }
      return albums;
    },

    /**
     * Load more asset when user scroll down
     */
    async onLoadMoreAssets() {
      if (this.currentPage < 0) return;
      this.currentPage++;

      const albums = await this.getCommunityAlbums(this.currentPage);
      if (albums.communities.length === 0) {
        // there is no more assets to fetch
        this.currentPage = -1;
      }

      this.albums.communities = [
        ...this.albums.communities,
        ...albums.communities
      ];
    }
  }
};
