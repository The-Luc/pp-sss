export default {
  props: {
    message: {
      type: String,
      default: 'Saving...'
    },
    status: {
      type: String,
      default: ''
    }
  },
  watch: {
    message() {
      console.log(this.message);
    },
    status() {
      console.log(this.status);
    }
  }
};
