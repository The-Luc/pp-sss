export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * Fire when user click on remove button
     * use to remove background
     */
    onRemove() {
      this.$emit('click');
    }
  }
};
