import Color from '@/containers/Color';

export default {
  components: {
    Color
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    /**
     * Callback function to get color and emit
     *
     * @param {String}  color  color value
     */
    onChange(color) {
      this.$emit('change', color);
    }
  }
};
