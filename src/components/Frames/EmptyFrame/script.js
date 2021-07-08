export default {
  methods: {
    /**
     * Fire when click add frame button
     * @param {Object} event mouse event parameter when click element
     */
    onClickAddFrame(event) {
      this.$emit('click', event);
    }
  }
};
