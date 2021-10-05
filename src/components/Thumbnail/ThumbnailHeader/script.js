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
    },
    isExpanded: {
      type: Boolean,
      default: true
    },
    isOpenMenu: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    arrowIcon() {
      return this.isExpanded ? 'arrow_drop_down' : 'arrow_right';
    },
    isTotalDisplayed() {
      return this.totalItem > 0;
    }
  },
  methods: {
    /**
     * Event fire when click more action
     * @param {Object} event fired event
     */
    toggleMenu(event) {
      this.$emit('toggleMenu', event);
    }
  }
};
