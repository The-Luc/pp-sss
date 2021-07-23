import FillColor from '@/containers/Properties/Features/FillColor';
import Opacity from '@/components/Properties/Features/Opacity';
import Shadow from '@/components/Properties/Features/Shadow';
import Border from '@/components/Properties/Features/Border';

export default {
  components: {
    FillColor,
    Opacity,
    Shadow,
    Border
  },
  props: {
    colorValue: {
      type: String,
      default: ''
    },
    opacityValue: {
      type: Number,
      required: true
    },
    currentShadow: {
      type: Object,
      default: () => ({})
    },
    isAllowFillColor: {
      type: Boolean,
      default: true
    },
    isShowBorder: {
      type: Boolean,
      default: false
    },
    currentBorder: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    /**
     * Emit value shadow config base on enable/disable of dropShadow
     * @param {Object} Object the value of the shadow will be change
     */
    onChangeDropShadow(object) {
      this.$emit('changeShadow', object);
    },
    /**
     * Emit value shadow config after user select shadow value
     * @param {Object} object the value of shadow will be change
     */
    onChangeShadow(object) {
      this.$emit('changeShadow', object);
    },
    /**
     * Emit value opacity to parent
     * @param   {Number}  opacity Value user input
     */
    onChangeOpacity(opacity) {
      this.$emit('change', { opacity });
    },
    /**
     * Emit value opacity to parent
     * @param {String}  color value user input
     */
    onChangeColor(color) {
      this.$emit('change', { color, stroke: color });
    },
    /**
     * Emit border option selected
     * @param {Object} borderCfg Border option selected
     */
    onChangeBorder(object) {
      this.$emit('changeBorder', object);
    }
  }
};
