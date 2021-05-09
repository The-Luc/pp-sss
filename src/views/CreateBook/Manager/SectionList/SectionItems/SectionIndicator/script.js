export default {
  props: {
    isTop: {
      type: Boolean
    }
  },
  computed: {
    position() {
      return !this.isTop ? 'bottom' : 'top';
    }
  }
};
