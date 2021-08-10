export default {
  props: {
    search: {
      type: String,
      default: 'Untitled'
    }
  },
  computed: {
    name() {
      return this.search?.trim();
    }
  }
};
