import RangeSlider from '@/components/Slider/RangeSlider';

export default {
  components: {
    RangeSlider
  },
  methods: {
    /**
     * Fire when user change either ends
     * @param   {Array}  value of slider
     */
    onSliderChange(value) {
      console.log('slider change ' + value);
    }
  }
};
