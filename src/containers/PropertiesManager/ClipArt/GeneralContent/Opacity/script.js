import SliderOpacity from '@/components/Slider';

export default {
  components: {
    SliderOpacity
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  methods: {
    /**
     * Emit value when change slider opacity
     * @param {Number} value value opacity of slider
     */
    onChange(value) {
      this.$emit('change', value);
    }
  }
};
