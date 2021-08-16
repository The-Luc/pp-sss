import RangeSlider from '@/components/RangeSlider';

export default {
  components: {
    RangeSlider
  },

  methods: {
    /**
     * Fire when user change either ends of range slider
     * @param   {Array}  value of slider
     */
    onSliderChange(value) {
      console.log('slider change ' + value);
    },

    /**
     * Fire when user click on Select Image button
     */
    onClickSelectImage() {
      //
    }
  }
};
