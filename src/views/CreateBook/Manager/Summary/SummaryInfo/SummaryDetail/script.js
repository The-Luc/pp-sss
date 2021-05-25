export default {
  props: {
    name: {
      type: String,
      required: true
    },
    description: {
      type: [Number, String],
      required: true
    },
    customClass: {
      type: String
    }
  }
};
