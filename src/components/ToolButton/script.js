export default {
  props: {
    iconName: {
      type: String
    },
    title: {
      type: String
    },
    textName: {
      type: String
    },
    width: {
      type: Number,
      default: 38
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    onClick() {
      this.$emit('click');
    }
  }
};
