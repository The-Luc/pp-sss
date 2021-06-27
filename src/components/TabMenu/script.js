export default {
  props: {
    activeTabName: {
      type: String
    }
  },
  data() {
    return {
      tabName: this.activeTabName
    };
  },
  watch: {
    activeTabName(newValue, oldValue) {
      if (newValue !== oldValue) this.tabName = newValue;
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
