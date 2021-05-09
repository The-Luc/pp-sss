import Item from './Item';

export default {
  components: {
    Item
  },
  data() {
    return {};
  },
  props: {
    nudgeWidth: {
      type: String,
      default: '160'
    },
    items: {
      type: Array
    },
    id: {
      type: String
    },
    menuX: {
      type: Number
    },
    menuY: {
      type: Number
    },
    isOpen: {
      type: Boolean
    }
  },
  methods: {
    onItemClick(event, item) {
      this.$emit('onItemClick', {
        event,
        item
      });
    }
  }
};
