import PreviewThumbnail from '../../PreviewThumbnail';

export default {
  components: {
    PreviewThumbnail
  },
  props: {
    portraits: {
      type: Array
    },
    layout: {
      type: Object
    },
    pageNo: {
      type: Number
    },
    backgroundUrl: {
      type: String
    },
    isDisableMoveBack: {
      type: Boolean,
      default: false
    },
    isDisableMoveNext: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * Select last page
     */
    onMoveBack() {
      this.$emit('moveBack', { selectedPage: this.pageNo });
    },
    /**
     * Select next page
     */
    onMoveNext() {
      this.$emit('moveNext', { selectedPage: this.pageNo });
    }
  }
};
