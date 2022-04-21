export default {
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    },
    isMediaAdditionalDisplayed: {
      type: Boolean,
      default: false
    },
    btnAction: {
      type: String,
      default: 'Select'
    }
  },
  methods: {
    /**
     * Select photo by emit to parent
     */
    onSelect() {
      this.$emit('select');
    },
    /**
     * Emit cancel event to parent
     */
    onCancel() {
      this.$emit('cancel');
    }
  }
};
