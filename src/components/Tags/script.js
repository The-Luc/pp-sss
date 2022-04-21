export default {
  components: {},
  props: {
    keyword: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    /**
     * Trigger emit event when click got it
     * @param  {Object} keyword value and status (active/inactive) of keyword
     * @param  {Boolean} isNative check status (active/inactive) of keyword
     */
    onclick(keyword, isNative) {
      if (isNative && keyword.active) return;
      this.$emit('click', keyword);
    }
  }
};
