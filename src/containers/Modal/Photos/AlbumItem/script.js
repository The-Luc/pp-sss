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
    imagesSelected: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    idSelected() {
      return this.imagesSelected.map(item => item.id);
    }
  },
  methods: {
    /**
     * Active image selected
     * @param   {Number}  id  id of image selected
     * @returns {Boolean} Image is actived
     */
    isActive(id) {
      return this.idSelected.includes(id);
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
