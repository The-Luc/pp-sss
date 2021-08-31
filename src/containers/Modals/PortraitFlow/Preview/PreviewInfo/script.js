export default {
  props: {
    totalPortrait: {
      type: Number,
      default: 0
    },
    totalPage: {
      type: Number,
      default: 0
    }
  },
  methods: {
    /**
     * Open Preview modal
     */
    onShowPreview() {
      console.log('open preview');
    }
  }
};
