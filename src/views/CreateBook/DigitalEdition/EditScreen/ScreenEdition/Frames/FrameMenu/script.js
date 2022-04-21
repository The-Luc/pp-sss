import Menu from '@/components/Menu';

export default {
  components: {
    Menu
  },
  props: {
    menuX: {
      type: Number,
      default: 0
    },
    menuY: {
      type: Number,
      default: 0
    },
    isOpen: Boolean
  },
  data() {
    return {
      isOpenMenu: false
    };
  },
  watch: {
    isOpen() {
      this.isOpenMenu = !this.isOpenMenu;
    }
  },
  methods: {
    onClickOutsideMenu() {
      this.$emit('onClose');
    },
    onReplaceLayout() {
      this.$emit('onReplaceLayout');
    },
    onDelete() {
      this.$emit('onDeleteFrame');
    }
  }
};
