import PreviewThumbnail from '@/components/Portrait/PreviewThumbnail';

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
    backgroundUrl: {
      type: String
    },
    flowNumber: {
      type: Number,
      default: 1
    },
    pageNumber: {
      type: Number,
      default: 1
    },
    isUseMargin: {
      type: Boolean,
      default: false
    },
    flowSettings: {
      type: Object,
      default: () => ({})
    }
  }
};
