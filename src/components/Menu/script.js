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
    },
    isCloseMenu: {
      type: Boolean,
      default: false
    },
    contentClass: {
      type: String,
      default: 'pp-menu'
    },
    container: {
      type: String
    }
  },
  methods: {
    onItemClick(event, item) {
      this.$emit('onItemClick', {
        event,
        item
      });
    },
    onClickOutsideMenu() {
      this.$emit('onClickOutsideMenu');
    }
  },
  mounted() {
    this.$root.$emit('menu', this.$refs.menu);
  }
};
