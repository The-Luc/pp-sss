import PreviewThumbnail from '../../../PreviewThumbnail';

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
    },
    flowSettings: {
      type: Object,
      default: () => ({})
    },
    isDigital: {
      type: Boolean
    },
    containerName: {
      type: String
    }
  },
  data() {
    return {
      disabled: false
    };
  },
  watch: {
    pageNo(newValue, oldValue) {
      if (newValue === oldValue) return;

      this.disabled = true;

      setTimeout(() => (this.disabled = false), 560);
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
