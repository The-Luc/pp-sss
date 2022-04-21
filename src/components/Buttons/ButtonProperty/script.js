export default {
  props: {
    iconName: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick(event) {
      this.$emit('click', event);
    }
  }
};
