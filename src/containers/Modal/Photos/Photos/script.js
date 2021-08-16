import Modal from '@/containers/Modal';
import SelectPhotoType from './SelectPhotoType';
import AlbumItem from '../AlbumItem';
import PopupSelected from '../PopupSelected';

import { getAlbums, getPhotoDropdowns } from '@/api/photo';

import {
  PHOTO_CATEGORIES,
  ALL_PHOTO_SUBCATEGORY_ID
} from '@/common/constants/photo';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    Modal,
    SelectPhotoType,
    AlbumItem,
    PopupSelected
  },
  props: {
    selectedImages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedType: {
        value: PHOTO_CATEGORIES.COMMUNITIES.value,
        sub: { value: ALL_PHOTO_SUBCATEGORY_ID }
      },
      albums: [],
      photoDropdowns: []
    };
  },
  computed: {
    selectedAlbums() {
      const albumId = this.getSelectedImageId();

      if (albumId === ALL_PHOTO_SUBCATEGORY_ID)
        return this.getAllSelectedAlbums();

      return this.albums.filter(item => {
        return !isEmpty(item.assets) && item.id === albumId;
      });
    },
    dropdownOptions() {
      return this.getDropdownOptions();
    },

    isShowPopupSelected() {
      return this.selectedImages.length !== 0;
    },

    isEmptyCategory() {
      return isEmpty(this.selectedAlbums);
    },

    currentCategory() {
      return (
        Object.values(PHOTO_CATEGORIES).find(
          item => item.value === this.selectedType.value
        )?.name || ''
      );
    }
  },
  methods: {
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
    },
    /**
     * Selected a image and emit parent component
     * @param   {Object}  image  id of current book
     */
    onSelectedImage(image) {
      this.$emit('change', image);
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

      return this.albums.filter(item => {
        return !isEmpty(item.assets) && selectedAlbumIds.includes(item.id);
      });
    },
    /**
     * Get category menu
     *
     * @returns {Array} category menu
     */
    getDropdownOptions() {
      const options = Object.values(PHOTO_CATEGORIES);

      if (isEmpty(this.photoDropdowns)) {
        return options.map(o => ({ ...o, subItems: [] }));
      }

      return options.map(opt => {
        const category = this.photoDropdowns[opt.value];

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
  },
  async created() {
    if (isEmpty(this.albums)) {
      this.albums = await getAlbums();
    }
    if (isEmpty(this.photoDropdowns)) {
      this.photoDropdowns = await getPhotoDropdowns();
    }
  }
};
