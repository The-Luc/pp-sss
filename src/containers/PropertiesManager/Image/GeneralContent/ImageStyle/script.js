export default {
  data() {
    return {
      isShowDropdown: false
    };
  },
  props: {
    imagesStyle: {
      type: Array,
      require: true
    },
    imageStyleSelected: {
      type: Number,
      default: null
    }
  },
  computed: {
    imagesStyleSelectBox() {
      return this.imagesStyle.slice(0, 4);
    }
  },
  methods: {
    /**
     * Open dropdown image style
     */
    onOpenDropdown() {
      this.isShowDropdown = true;
    },
    /**
     * Close dropdown image style
     */
    onCloseDropdown() {
      this.isShowDropdown = false;
    },
    /**
     * Emit change image style to parent component
     * @param {Number} id - id's image style
     */
    onSelectImageStyle(id) {
      this.$emit('onSelectImageStyle', id);
    }
  }
};
