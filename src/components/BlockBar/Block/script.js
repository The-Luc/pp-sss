export default {
  props: {
    color: {
      type: String,
      required: false
    },
    text: {
      type: String,
      required: false
    },
    dataAttribute: {
      type: Array, // each: name, value
      required: false,
      default: () => []
    }
  },
  computed: {
    dataAttrs: function() {
      const dataAttrs = {};

      this.dataAttribute.forEach(dt => {
        dataAttrs[dt.name] = dt.value;
      });

      return dataAttrs;
    }
  }
};
