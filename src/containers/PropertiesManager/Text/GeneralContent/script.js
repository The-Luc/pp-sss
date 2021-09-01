import TextStyle from './TextStyle';
import Fonts from './Font';
import Effect from './Effect';
import Alignment from './Alignment';
import Vertical from './Vertical';
import Spacing from './Spacing';
import Animation from '@/components/Animation';
import { useAppCommon, useElementProperties } from '@/hooks';
import { EVENT_TYPE } from '@/common/constants';

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
    }
  },
  methods: {
    changeAnimation(val) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, val);
    }
  }
};
