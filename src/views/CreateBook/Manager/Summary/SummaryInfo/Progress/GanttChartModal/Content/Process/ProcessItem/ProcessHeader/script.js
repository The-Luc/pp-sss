export default {
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String
    }
  },
  computed: {
    useName() {
      return this.name;
    }
  }
};
