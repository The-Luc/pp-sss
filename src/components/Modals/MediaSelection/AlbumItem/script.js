import { ASSET_TYPE } from '@/common/constants';

export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    displayDate: {
      type: String,
      default: ''
    },
    assets: {
      type: Array,
      default: () => []
    },
    selectedImages: {
      type: Array,
      default: () => []
    },
    searchInput: {
      type: String,
      default: ''
    },
    emptyCategory: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    /**
     * Active media selected
     * @param   {Number}  id  id of selected media
     * @param   {Number}  albumId  id of selected media
     * @returns {Boolean} is active
     */
    isActive(id, albumId) {
      return this.selectedImages.some(
        media => media.id === id && media.albumId === albumId
      );
    },
    /**
     * Selected a image and emit parent component
     * @param   {Object}  image  id of current book
     */
    onSelected(image) {
      this.$emit('change', image);
    },
    /**
     * Check if the type is video or not
     * @param   {String}  type  type of asset
     * @returns {Boolean} type is video
     */
    isVideo(type) {
      return type === ASSET_TYPE.VIDEO;
    }
  }
};
