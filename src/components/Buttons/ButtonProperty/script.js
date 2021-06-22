export default {
  props: {
    iconName: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      required: true
    }
  },
  methods: {
    onClick(event) {
      this.$emit('click', event);
    }
  }
};
