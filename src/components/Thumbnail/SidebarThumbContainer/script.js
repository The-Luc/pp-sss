export default {
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    isEnable: {
      type: Boolean,
      default: false
    },
    totalSheet: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isOpen: true
    };
  },
  computed: {
    arrowIcon() {
      return this.isOpen ? 'arrow_drop_down' : 'arrow_right';
    },
    disabledCssClass() {
      return this.isEnable ? '' : 'disabled';
    }
  },
  methods: {
    /**
     * Toggle display sheets arena
     */
    toggleSheetsArena() {
      this.isOpen = !this.isOpen;
    }
  }
};
