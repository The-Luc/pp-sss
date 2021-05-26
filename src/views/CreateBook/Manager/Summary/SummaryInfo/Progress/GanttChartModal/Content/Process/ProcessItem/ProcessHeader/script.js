export default {
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String
    }
  },
  data() {
    return {
      isElementReady: false
    };
  },
  mounted() {
    this.isElementReady = true;
  },
  computed: {
    isTruncated: function() {
      if (!this.isElementReady) return false;

      return this.$refs.section.offsetWidth < this.$refs.section.scrollWidth;
    }
  }
};
