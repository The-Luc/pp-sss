import ColorPicker from '@/containers/ColorPicker';

export default {
  components: {
    ColorPicker
  },
  props: {
    selectedColor: {
      type: String,
      required: true
    }
  },
  methods: {
    /**
     * Callback function to get bordercolor and emit to text properties
     * @param {String} color Border color value
     */
    onChange(color) {
      this.$emit('change', color);
    }
  }
};
