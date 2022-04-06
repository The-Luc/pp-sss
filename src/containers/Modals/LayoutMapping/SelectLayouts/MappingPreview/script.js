export default {
  props: {
    isDigital: {
      type: Boolean,
      default: false
    },
    layout: {
      type: Object,
      default: {}
    }
  },
  computed: {
    title() {
      return this.isDigital
        ? 'Selected Digital Layout'
        : 'Selected Print Layout';
    },
    previewImages() {
      if (!this.isDigital) {
        return [this.layout.previewImageUrl];
      }
      const frames = this.layout?.frames || [];
      return frames.map(f => f.previewImageUrl);
    }
  },
  methods: {
    onClickEdit() {
      this.$emit('onEdit');
    }
  }
};
