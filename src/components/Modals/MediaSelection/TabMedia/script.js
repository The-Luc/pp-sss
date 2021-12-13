import { get } from 'lodash';

import PpSelect from '@/components/Selectors/SelectMultiLevel';
import AlbumItem from '../AlbumItem';
import PopupSelected from '../PopupSelected';

import {
  PHOTO_CATEGORIES,
  VIDEO_CATEGORIES,
  ALL_MEDIA_SUBCATEGORY_ID,
  ASSET_TYPE
} from '@/common/constants';
import { isEmpty, scrollToElement } from '@/common/utils';

export default {
  components: {
    PpSelect,
    AlbumItem,
    PopupSelected
  },
  props: {
    selectedMedia: {
      type: Array,
      default: () => []
    },
    selectedType: {
      type: Object,
      required: true
    },
    albums: {
      type: Object,
      default: () => ({})
    },
    mediaDropdowns: {
      type: Object,
      default: () => ({})
    },
    isVideo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      emptyCategory: {
        name: '',
        type: ''
      }
    };
  },
  computed: {
    selectedAlbums() {
      const albumId = this.getSelectedImageId();

      if (albumId === ALL_MEDIA_SUBCATEGORY_ID)
        return this.getAllSelectedAlbums();

      return this.currentAlbums.filter(item => item.id === albumId);
    },
    currentSubAlbums() {
      return this.albums[this.selectedType.value] || [];
    },
    dropdownOptions() {
      return this.getDropdownOptions();
    },

    isShowPopupSelected() {
      return this.selectedMedia.length !== 0;
    },

    isEmptyCategory() {
      return isEmpty(this.selectedAlbums);
    },

    mediaCategories() {
      return this.isVideo ? VIDEO_CATEGORIES : PHOTO_CATEGORIES;
    },

    dropdownId() {
      return this.isVideo ? 'video-type' : 'photo-type';
    },

    currentAlbums() {
      return this.isVideo
        ? this.getCurrentVideoAlbums()
        : this.getCurrentPhotoAlbums();
    }
  },
  watch: {
    selectedAlbums() {
      const el = get({ refs: this.$refs }, 'refs["album-0"][0].$el');
      if (!el) return;

      scrollToElement(el, { behavior: 'auto', block: 'start' });
    }
  },
  methods: {
    /**
     * Change dropdown type to select a album
     * @param   {Object}  data  type and album selected
     */
    onChangeType(data) {
      this.$emit('changeType', data);
    },
    /**
     * Selected a media and emit parent component
     * @param   {Object}  media  id of asset
     * @param   {String}  albumId  albumId id of asset
     */
    onSelectedMedia(media, albumId) {
      this.$emit('change', { ...media, albumId });
    },
    /**
     * Get id of selected album
     *
     * @returns {Array} id of selected album
     */
    getSelectedImageId() {
      if (isEmpty(this.selectedType.sub)) return null;

      return this.selectedType.sub.sub?.value || this.selectedType.sub.value;
    },
    /**
     * Get id of all selected album when user select all
     *
     * @returns {Array} array id of selected albums
     */
    getAllSelectedAlbums() {
      const typeSelected = this.dropdownOptions.find(
        item => item.value === this.selectedType.value
      );

      const arrayAlbumSelected = this.selectedType.sub?.sub?.value
        ? typeSelected.subItems.find(item => {
            return item.value === this.selectedType.sub?.value;
          }).subItems
        : typeSelected.subItems;

      const selectedAlbumIds = arrayAlbumSelected.map(item => item.value);

      return this.currentAlbums.filter(item => {
        return !isEmpty(item.assets) && selectedAlbumIds.includes(item.id);
      });
    },
    /**
     * Get category menu
     *
     * @returns {Array} category menu
     */
    getDropdownOptions() {
      const options = Object.values(this.mediaCategories);

      if (isEmpty(this.mediaDropdowns)) {
        return options.map(o => ({ ...o, subItems: [] }));
      }

      return options.map(opt => {
        const category = this.mediaDropdowns[opt.value];

        return {
          ...opt,
          subItems: isEmpty(category) ? [] : this.getOptionSubs(category)
        };
      });
    },
    /**
     * Get sub category menu
     *
     * @returns {Array} sub category menu
     */
    getOptionSubs(subCategories) {
      return subCategories.map(({ id, name, albums }) => {
        const cat = { value: id, name: name, subItems: [] };

        if (isEmpty(albums)) return cat;

        const subItems = albums.map(album => ({
          value: album.id,
          name: album.name,
          subItems: []
        }));

        return { ...cat, subItems };
      });
    },
    /**
     * Get current video albums
     */
    getCurrentVideoAlbums() {
      return this.currentSubAlbums.map(item => {
        const assets = item.assets.filter(el => el.type === ASSET_TYPE.VIDEO);
        return {
          ...item,
          assets
        };
      });
    },
    /**
     * Get current photo albums
     */
    getCurrentPhotoAlbums() {
      return this.currentSubAlbums.map(item => {
        const assets = item.assets.filter(el => el.type === ASSET_TYPE.PICTURE);
        return {
          ...item,
          assets
        };
      });
    },
    /**
     * Event change display selected and get empty category
     */
    changeDisplaySelected(val) {
      this.emptyCategory = {
        name: val,
        type: this.isVideo ? 'videos' : 'photos'
      };
    }
  }
};
