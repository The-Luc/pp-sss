export default {
  props: {
    activeTabName: {
      type: String
    }
  },
  methods: {
    /**
     * Emit event change tab with current data to parent
     */
    onChange(data) {
      this.$emit('change', data);
    }
  }
};
