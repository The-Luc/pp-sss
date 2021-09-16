import FillColor from '@/containers/Properties/Features/FillColor';
import Opacity from '@/components/Properties/Features/Opacity';
import PpShadow from '@/components/Properties/Features/Shadow';
import Border from '@/components/Properties/Features/Border';
import Animation from '@/components/Properties/Features/Animation';

export default {
  components: {
    FillColor,
    Opacity,
    PpShadow,
    Border,
    Animation
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
    },
    isDigital: {
      type: Boolean
    },
    playInConfig: {
      type: Object,
      default: () => ({})
    },
    playOutConfig: {
      type: Object,
      default: () => ({})
    },
    animationTitle: {
      type: String,
      default: ''
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
    },
    /**
     * Emit animation option selected
     * @param {Object} animationConfig Animation option selected
     */
    onChangeAnimation(object) {
      this.$emit('change', object);
    },
    /**
     * Emit apply option selected
     * @param {Object} applyOption apply option selected
     */
    onApplyAnimation(object) {
      this.$emit('onApply', object);
    },
    /**
     * Emit preview option selected object
     * @param {Object} animationConfig preview option
     */
    onClickPreview(config) {
      this.$emit('preview', config);
    }
  }
};
