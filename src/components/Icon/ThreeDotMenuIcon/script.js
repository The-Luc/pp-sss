export default {
  methods: {
    /**
     * Emit click event to parent
     *
     * @param {Object} event mouse event
     */
    onClick(event) {
      this.$emit('click', { event });
    }
  }
};
