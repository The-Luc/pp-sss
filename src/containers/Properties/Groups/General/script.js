import FillColor from '@/components/Properties/Features/FillColor';
import Opacity from '@/components/Properties/Features/Opacity';
import PpShadow from '@/components/Properties/Features/Shadow';
import Border from '@/components/Properties/Features/Border';
import Animation from '@/components/Properties/Features/Animation';

import {
  useAnimation,
  useElementProperties,
  useObjectProperties
} from '@/hooks';

import {
  CLIP_ART_APPLY_OPTIONS,
  IMAGE_APPLY_OPTIONS,
  OBJECT_TYPE,
  SHAPE_APPLY_OPTIONS
} from '@/common/constants';
import { getOrdeOptions } from '@/common/utils';

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
    isAnimationDisplayed: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const { listObjects } = useObjectProperties();
    const { getProperty } = useElementProperties();
    const { playInOrder, playOutOrder } = useAnimation();

    return { listObjects, getProperty, playInOrder, playOutOrder };
  },
  data() {
    const objectType = this.getProperty('type');

    return {
      animationTitle: this.getAnimationTitle(objectType),
      applyOptions: this.getApplyOptions(objectType),
      orderOptions: getOrdeOptions(this.listObjects)
    };
  },
  computed: {
    playInConfig() {
      return this.getProperty('animationIn') || {};
    },
    playOutConfig() {
      return this.getProperty('animationOut') || {};
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
    },
    /**
     * Emit order option selected object
     * @param {Object} order order option
     */
    onChangeOrder(order) {
      this.$emit('changeOrder', order);
    },
    /**
     * Get animation title for current object
     *
     * @param   {String}  objectType  type of current object
     * @returns {String}              title
     */
    getAnimationTitle(objectType) {
      if (objectType === OBJECT_TYPE.SHAPE) return 'Shape Animation';

      if (objectType === OBJECT_TYPE.CLIP_ART) return 'Clip Art Animation';

      if (objectType === OBJECT_TYPE.IMAGE) return 'Image Animation';

      return '';
    },
    /**
     * Get apply options for current object
     *
     * @param   {String}  objectType  type of current object
     * @returns {Array}               array options
     */
    getApplyOptions(objectType) {
      if (objectType === OBJECT_TYPE.SHAPE) return SHAPE_APPLY_OPTIONS;

      if (objectType === OBJECT_TYPE.CLIP_ART) return CLIP_ART_APPLY_OPTIONS;

      if (objectType === OBJECT_TYPE.IMAGE) return IMAGE_APPLY_OPTIONS;

      return [];
    }
  }
};
