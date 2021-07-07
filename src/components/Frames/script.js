import EmptyFrame from './EmptyFrame';

export default {
  components: {
    EmptyFrame
  },
  methods: {
    /**
     * Fire when click add frame button
     * @param {Object} event mouse event parameter when click element
     */
    addFrame(event) {
      this.$emit('addFrame', event);
    }
  }
};
