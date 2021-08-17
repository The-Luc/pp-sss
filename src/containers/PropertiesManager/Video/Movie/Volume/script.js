import Slider from '@/components/Slider';

export default {
  components: {
    Slider
  },
  data() {
    return {
      volume: 0
    };
  },
  methods: {
    /**
     * Handle change value
     * @param {Number} val - the value returned from slider
     */
    onChange(val) {
      // handler volume changed
      console.log('volume value' + val);
    }
  }
};
