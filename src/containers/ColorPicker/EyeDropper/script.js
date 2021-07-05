import PpEyeDropper from '@/components/EyeDropper';

import { ICON_LOCAL, KEY_CODE } from '@/common/constants';

export default {
  components: {
    PpEyeDropper
  },
  data() {
    return {
      eyeDropperIcon: ICON_LOCAL.EYE_DROPPER,
      color: '',
      canvasRect: {
        x: 0,
        y: 0,
        width: 0,
        top: 0
      }
    };
  },
  mounted() {
    this.setOverlayDimenssion();
    window.addEventListener('resize', this.setOverlayDimenssion);
  },
  beforeDestroy() {
    window.addEventListener('resize', this.setOverlayDimenssion);
  },
  methods: {
    /**
     * Callback function check user click outside overlay
     */
    onClickOutside() {
      this.$emit('clickOutside');
    },
    /**
     * Callback function check user click on overlay and emit color to parent
     */
    onClick() {
      this.$emit('click', this.color);
    },
    /**
     * Callback function get color when user move mouse and set to data
     */
    onChangeColor(color) {
      this.color = color;
    },
    /**
     * Callback function check user press Escape and reset eye dropper action
     * @param {Event} event Event key up
     */
    onKeyPress(event) {
      const key = event.keyCode || event.charCode;
      if (key === KEY_CODE.ESCAPE) {
        this.$emit('escape');
      }
    },
    /**
     * Function get current canvas's dimenssion and apply to overlay
     */
    setOverlayDimenssion() {
      const canvas = window.printCanvas || window.digitalCanvas;
      const {
        top,
        left,
        width,
        height
      } = canvas.lowerCanvasEl.getBoundingClientRect();
      this.canvasRect = {
        ...this.canvasRect,
        top,
        left,
        width,
        height
      };
    }
  }
};
