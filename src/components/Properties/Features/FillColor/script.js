import ColorPicker from '@/containers/ColorPicker';

export default {
  components: {
    ColorPicker
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
