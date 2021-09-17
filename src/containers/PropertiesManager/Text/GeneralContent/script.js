import Alignment from '@/components/Properties/Groups/TextProperties/Alignment';
import Animation from '@/components/Properties/Features/Animation';
import TextStyle from './TextStyle';
import Fonts from './Font';
import Effect from './Effect';
import Vertical from './Vertical';
import Spacing from './Spacing';

import { useAppCommon, useElementProperties, useAnimation } from '@/hooks';
import {
  EVENT_TYPE,
  OBJECT_TYPE,
  TEXT_HORIZONTAL_ALIGN
} from '@/common/constants';

export default {
  components: {
    TextStyle,
    Fonts,
    Effect,
    Alignment,
    Vertical,
    Spacing,
    Animation
  },
  setup() {
    const { isDigitalEdition } = useAppCommon();
    const { getProperty } = useElementProperties();
    const { playInOrder, playOutOrder } = useAnimation();

    return {
      getProperty,
      isDigitalEdition,
      playInOrder,
      playOutOrder
    };
  },
  computed: {
    playInConfig() {
      return this.getProperty('animationIn') || {};
    },
    playOutConfig() {
      return this.getProperty('animationOut') || {};
    },
    selectedAlignment() {
      return (
        this.getProperty('alignment')?.horizontal || TEXT_HORIZONTAL_ALIGN.LEFT
      );
    }
  },
  methods: {
    /**
     * Change text property for text box selected
     * @param  {String} color Receive value information to change
     */
    onChange(val) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, val);
    },

    /**
     * Handle apply animation configuration
     * @param {Object} val animation config will be applied to objects
     */
    onApply(val) {
      this.$root.$emit(EVENT_TYPE.APPLY_ANIMATION, {
        objectType: OBJECT_TYPE.TEXT,
        ...val
      });
    },

    /**
     * Handle change object's animation order
     * @param {Number} order animation order
     */
    onChangeOrder(order) {
      this.$root.$emit(EVENT_TYPE.CHANGE_ANIMATION_ORDER, order);
    },
    /**
     * Emit preview option selected object
     * @param {Object} animationConfig preview option
     */
    onClickPreview(config) {
      this.$root.$emit(EVENT_TYPE.PREVIEW_ANIMATION, config);
    }
  }
};
