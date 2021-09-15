export default {
  props: {
    savedSettings: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    /**
     * Emit event load setting to parent
     * @param {Number}  id id of portrait setting to load
     */
    loadSetting(id) {
      this.$emit('loadSetting', id);
    }
  }
};
