export default {
  data() {
    return {
      isShowDropdown: false
    };
  },
  props: {
    options: {
      type: Array,
      require: true
    },
    styleSelected: {
      type: Number,
      default: null
    }
  },
  computed: {
    imageStyleOptions() {
      return this.options.slice(0, 4);
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
    onSelect(id) {
      this.$emit('onSelectImageStyle', id);
    }
  }
};
