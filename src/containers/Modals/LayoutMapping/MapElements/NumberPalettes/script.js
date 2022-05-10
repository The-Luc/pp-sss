export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    posX: {
      type: Number,
      required: true
    },
    posY: {
      type: Number,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    /**
     * Fire when user click to select a item on the list
     *
     * @param {Object}  item  selected community member
     */
    onSelected(item) {
      this.$emit('change', item);
    },
    /**
     * Fire when user click outside of assignee modal
     */
    onClickOutside() {
      this.$emit('clickOutside');
    }
  }
};
