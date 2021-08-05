export default {
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  methods: {
    /**
     * Trigger emit event when click got it
     */
    onClick() {
      this.$emit('click');
    }
  }
};
