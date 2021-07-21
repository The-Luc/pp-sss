import FillColor from '@/containers/Properties/Features/FillColor';
import Opacity from '@/components/Properties/Features/Opacity';
import Shadow from '@/components/Properties/Features/Shadow';

export default {
  components: {
    FillColor,
    Opacity,
    Shadow
  },
  props: {
    colorValue: {
      type: String,
      required: true
    },
    opacityValue: {
      type: Number,
      required: true
    },
    currentShadow: {
      type: Object,
      required: true
    },
    isAllowFillColor: {
      type: Boolean,
      default: true
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
    }
  }
};
