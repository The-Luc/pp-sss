import Alignment from '@/components/Properties/Groups/TextProperties/Alignment';
import Animation from '@/components/Properties/Features/Animation';
import TextStyle from './TextStyle';
import Fonts from './Font';
import Effect from './Effect';
import Vertical from './Vertical';
import Spacing from './Spacing';

import { useAppCommon, useElementProperties } from '@/hooks';
import { EVENT_TYPE, TEXT_HORIZONTAL_ALIGN } from '@/common/constants';

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

    return {
      getProperty,
      isDigitalEdition
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

    onApply(val) {
      this.$root.$emit(EVENT_TYPE.APPLY_TEXT_ANIMATION, val);
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
