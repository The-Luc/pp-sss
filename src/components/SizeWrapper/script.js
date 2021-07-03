import Color from 'color';

import { ICON_LOCAL, KEY_CODE } from '@/common/constants';
import { useEyeDropper } from '@/hooks';

import EyeDropper from '@/components/EyeDropper';

export default {
  setup() {
    const { eyeDropper, toggleEyeDropper } = useEyeDropper();
    return {
      eyeDropper,
      toggleEyeDropper
    };
  },
  components: {
    EyeDropper
  },
  data() {
    return {
      eyeDropperIcon: ICON_LOCAL.EYE_DROPPER,
      awaitPickColor: false,
      color: ''
    };
  },

  mounted() {
    this.$emit('mounted', this.getAvailableSize());
    window.addEventListener('resize', this.onResized);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResized);
  },
  methods: {
    /**
     * Computed dimenssion of current wrapper
     * @returns {Object} { width, height, ratio}
     * @property {Number} width Width after subtract offset
     * @property {Number} height Height after subtract offset
     * @property {Number} ratio Ratio view base on width and height after computed
     */
    getAvailableSize() {
      const { clientWidth, clientHeight } = this.$refs.sizeWrapper;

      const offset = 0;
      const width = clientWidth - offset;
      const height = clientHeight - offset;

      return {
        width,
        height,
        ratio: width / height
      };
    },
    /**
     * Callback function emit size to parent
     */
    onResized() {
      this.$emit('updated', this.getAvailableSize());
    },
    /**
     * Callback function catch event user click on overlay to pick color and mutate to stop eye dropper event
     */
    onEyeDropperOverlayClick() {
      const hexClr = Color(this.color).hex();

      this.$root.$emit(this.eyeDropper.eventName, hexClr);

      this.toggleEyeDropper({ isOpen: false, eventName: '' });
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
        this.toggleEyeDropper({ isOpen: false, eventName: '' });
      }
    }
  }
};
