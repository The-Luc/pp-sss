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
    },
    specialWidth: {
      type: Number
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
