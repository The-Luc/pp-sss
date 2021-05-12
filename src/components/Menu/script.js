import Item from './Item';

export default {
  components: {
    Item
  },
  props: {
    nudgeWidth: {
      type: String,
      default: '160'
    },
    src: {
      type: String
    },
    items: {
      type: Array
    }
  }
};
