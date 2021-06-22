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
      if (this.disabled) return;
      console.log('onClick', this.item.value);
    }
  }
};
