export default {
  props: {
    iconName: {
      type: String
    },
    isPrompt: {
      type: Boolean,
      default: false
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
