import PreviewThumbnail from '../../../PreviewThumbnail';

export default {
  components: {
    PreviewThumbnail
  },
  props: {
    portraits: {
      type: Array,
      default: () => [[]]
    },
    layout: {
      type: Object,
      default: () => ({})
    },
    background: {
      type: Object,
      default: () => ({})
    },
    isFullBackground: {
      type: Boolean,
      default: false
    },
    flowNumber: {
      type: Number,
      default: 1
    },
    pageNumber: {
      type: Number,
      default: 1
    },
    screenNumber: {
      type: Number,
      default: null
    },
    isUseMargin: {
      type: Boolean,
      default: false
    },
    flowSettings: {
      type: Object,
      default: () => ({})
    },
    isDigital: {
      type: Boolean
    }
  },
  computed: {
    rightText() {
      return this.isDigital
        ? `Screen ${this.screenNumber}: Frame ${this.pageNumber}`
        : `Page ${this.pageNumber}`;
    }
  }
};
