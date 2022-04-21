import Slider from '@/components/Slider/Slider';

import { DEFAULE_SLIDER } from '@/common/constants';

export default {
  props: {
    title: {
      type: String
    },
    value: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      trackFillColor: DEFAULE_SLIDER.COLOR
    };
  },
  components: {
    Slider
  },
  methods: {
    /**
     * Handle when slider changed
     * @param {Object} event Event change slider
     */
    onChange(event) {
      this.$emit('change', event);
    }
  }
};
