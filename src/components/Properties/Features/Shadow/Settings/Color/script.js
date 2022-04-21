import ColorPicker from '@/containers/ColorPicker';

export default {
  components: {
    ColorPicker
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
      this.$emit('change', { shadowColor: color });
    }
  }
};
