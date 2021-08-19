import PpSelect from '@/components/Selectors/SelectMultiLevel';
import AlbumItem from '@/components/ModalMediaSelection/AlbumItem';
import PopupSelected from '@/components/ModalMediaSelection/PopupSelected';

import {
  PHOTO_CATEGORIES,
  VIDEO_CATEGORIES,
  ALL_MEDIA_SUBCATEGORY_ID,
  ASSET_TYPE
} from '@/common/constants';
import { isEmpty } from '@/common/utils';

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
      type: Array,
      default: () => []
    },
    mediaDropdowns: {
      type: Object,
      default: {}
    },
    isVideo: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    selectedAlbums() {
      const albumId = this.getSelectedImageId();

      if (albumId === ALL_MEDIA_SUBCATEGORY_ID)
        return this.getAllSelectedAlbums();

      return this.currentAlbums.filter(item => {
        return !isEmpty(item.assets) && item.id === albumId;
      });
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

    currentCategory() {
      return (
        Object.values(this.mediaCategories).find(
          item => item.value === this.selectedType.value
        )?.name || ''
      );
    },

    mediaCategories() {
      return this.isVideo ? VIDEO_CATEGORIES : PHOTO_CATEGORIES;
    },

    idOfComponentSelect() {
      return this.isVideo ? 'video-type' : 'photo-type';
    },

    currentAlbums() {
      if (this.isVideo) {
        return this.albums.map(item => {
          const assets = item.assets.filter(el => el.type === ASSET_TYPE.VIDEO);
          return {
            ...item,
            assets
          };
        });
      }

      return this.albums.map(item => {
        const assets = item.assets.filter(el => el.type === ASSET_TYPE.PICTURE);
        return {
          ...item,
          assets
        };
      });
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
     */
    onSelectedMedia(media) {
      this.$emit('change', media);
    },
    /**
     * Get id of selected album
     *
     * @returns {Array} id of selected album
     */
    getSelectedImageId() {
      return this.selectedType.sub.sub || this.selectedType.sub.value;
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

      const arrayAlbumSelected = this.selectedType.sub.sub
        ? typeSelected.subItems.find(item => {
            return item.value === this.selectedType.sub.value;
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
    }
  }
};
