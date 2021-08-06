export default {
  components: {},
  props: {
    keyword: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    onclick(keyword, isNative) {
      if (isNative && keyword.active) return;
      this.$emit('click', keyword);
    }
  }
};
