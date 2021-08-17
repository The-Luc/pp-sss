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
      type: String,
      default: ''
    }
  },
  computed: {
    selectedImageIds() {
      return this.selectedImages.map(item => item.id);
    }
  },
  methods: {
    /**
     * Active image selected
     * @param   {Number}  id  id of selected image
     * @returns {Boolean} Image is actived
     */
    isActive(id) {
      return this.selectedImageIds.includes(id);
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
