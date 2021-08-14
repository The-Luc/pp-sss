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
