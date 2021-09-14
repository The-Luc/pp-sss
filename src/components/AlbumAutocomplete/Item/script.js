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

      if (totalAseets < 1) return 0;

      return totalAseets < 4 ? 1 : 4;
    }
  }
};
