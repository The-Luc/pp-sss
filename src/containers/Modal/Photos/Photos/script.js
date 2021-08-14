import Modal from '@/containers/Modal';
import SelectPhotoType from './SelectPhotoType';
import AlbumItem from '../AlbumItem';
import PopupSelected from '../PopupSelected';
import { photoDropdowns } from '@/mock/photoDropdowns';
import { albums } from '@/mock/photo';
import { getAlbums, getPhotoDropdowns } from '@/api/photo';

import {
  PHOTO_DROPDOWNS,
  ID_PHOTO_All
} from '@/common/constants/photoDropdowns';
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
        value: PHOTO_DROPDOWNS.COMMUNITIES.value,
        sub: {
          value: ID_PHOTO_All
        }
      },
      albums: [],
      photoDropdowns: []
    };
  },
  computed: {
    selectedAlbums() {
      const albumId = this.getSelectedImageId();

      if (albumId === ID_PHOTO_All) return this.getAllSelectedAlbums();

      return albums.filter(item => {
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
        Object.values(PHOTO_DROPDOWNS).find(
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

      return albums.filter(item => {
        return !isEmpty(item.assets) && selectedAlbumIds.includes(item.id);
      });
    },
    /**
     * Get array of dropdown from value api
     *
     * @returns {Array} array of dropdowns
     */
    getDropdownOptions() {
      const options = Object.values(PHOTO_DROPDOWNS);

      options.forEach(item => {
        item.subItems = photoDropdowns[item.value].map(el => {
          const result = {
            value: el.id,
            name: el.name,
            subItems: []
          };
          if (isEmpty(el?.albums)) return result;

          result.subItems = el.albums.map(album => ({
            value: album.id,
            name: album.name,
            subItems: []
          }));

          return result;
        });
      });
      return options;
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
