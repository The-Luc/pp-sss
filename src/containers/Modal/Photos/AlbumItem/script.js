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
      required: true
    },
    selectedImages: {
      type: Array,
      default: () => []
    },
    searchInput: {
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
    }
  }
};
