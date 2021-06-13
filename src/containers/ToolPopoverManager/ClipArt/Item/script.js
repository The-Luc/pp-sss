export default {
  props: {
    clipArt: {
      type: Object,
      required: true
    },
    selectedClipArtId: {
      type: Array,
      default: () => []
    },
    isEmpty: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isActive() {
      return this.selectedClipArtId.includes(this.clipArt.id);
    }
  },
  methods: {
    /**
     * Emit clip art selected to parent
     */
    onClick() {
      this.$emit('click', this.clipArt);
    }
  }
};
