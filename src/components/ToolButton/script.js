export default {
  props: {
    iconName: {
      type: String
    },
    title: {
      type: String
    },
    name: {
      type: String
    },
    iconNameActive: {
      type: String
    },
    textName: {
      type: String
    },
    width: {
      type: Number,
      default: 38
    }
  },
  methods: {
    onClick() {
      this.$emit('click');
    }
  }
};
