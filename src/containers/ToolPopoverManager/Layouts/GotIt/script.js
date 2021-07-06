export default {
  props: {
    textDisplay: {
      type: Object,
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
