export default {
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    value: {
      type: Array,
      default: () => [0, 100]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isHideEndThumb: {
      type: Boolean,
      default: false
    },
    startLineColor: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      trackColor: '#D3D3D3',
      trackFillColor: '#D3D3D3',
      thumbColor: '#FFFFFF'
    };
  },
  methods: {
    /**
     * Fire when user change either ends
     * @param   {Array}  value of slider
     */
    onSliderChange(value) {
      this.$emit('change', value);
    }
  },
  mounted() {
    const el = this.$refs.rangeSlider;

    // handle hide the 2nd thumb
    if (this.isHideEndThumb) {
      const secondThumbContainer = el.$refs.thumb_1;
      secondThumbContainer.style.display = 'none';
    }

    // handle change color of the vertical line of the first thumb
    if (this.startLineColor) {
      const firstThumb = el.$refs.thumb_0.firstElementChild;

      firstThumb.style.color = this.startLineColor;
    }
  }
};
