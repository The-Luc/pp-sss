export default {
  methods: {
    /**
     * Fire when user click on remove button
     * use to remove background
     */
    onRemove() {
      this.$root.$emit('printDeleteElements');
    }
  }
};
