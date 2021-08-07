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
    amountThumbnails() {
      return this.album.assets.length < 4 ? this.album.assets.length : 4;
    }
  }
};
