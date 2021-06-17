import Color from '@/containers/Color';

export default {
  components: {
    Color
  },
  props: {
    color: {
      type: String,
      required: true
    }
  },
  methods: {
    /**
     * Callback function to get color and emit to text properties
     * @param {String} color Color value
     */
    onColorChanged(color) {
      this.$emit('change', color);
    }
  }
};
