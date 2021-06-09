export default {
  methods: {
    /**
     * Emit event change tab to parent
     */
    onChange() {
      this.$emit('change');
    }
  }
};
