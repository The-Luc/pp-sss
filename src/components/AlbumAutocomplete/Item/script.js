export default {
  props: {
    album: {
      type: Object,
      required: true
    },
    parent: {
      type: Object,
      required: true
    }
  },
  computed: {
    totalThumbnailDisplay() {
      const totalAseets = this.album.assets.length;
      return totalAseets < 4 ? (totalAseets < 1 ? 0 : 1) : 4;
    }
  }
};
