export default {
  props: {
    color: {
      type: String
    },
    text: {
      type: String
    },
    dataAttribute: {
      type: Array, // each: name, value
      default: () => []
    },
    isSpaceByBorder: {
      type: Boolean,
      default: false
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
