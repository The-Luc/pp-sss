import Slider from '@/components/Slider';

export default {
  components: {
    Slider
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  methods: {
    onChange(value) {
      this.$emit('change', value);
    }
  }
};
