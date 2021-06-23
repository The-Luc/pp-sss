export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    // TODO later
    onClick() {
      if (this.item.disabled) return;
      this.$emit('click', this.item.value);
    }
  }
};
