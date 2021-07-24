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
    customCssClass: {
      type: Array,
      default: () => []
    },
    totalItem: {
      type: Number,
      default: 0
    },
    isToggleContentAvailable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    arrowIcon() {
      return this.isOpen ? 'arrow_drop_down' : 'arrow_right';
    },
    isTotalDisplayed() {
      return this.totalItem > 0;
    }
  },
  methods: {
    /**
     * Toggle display content by emit to container
     */
    toggleContent() {
      if (!this.isToggleContentAvailable) return;

      this.$emit('toggleContent');
    }
  }
};
