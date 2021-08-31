import TextStyle from './TextStyle';
import Fonts from './Font';
import Effect from './Effect';
import Alignment from './Alignment';
import Vertical from './Vertical';
import Spacing from './Spacing';
import Animation from '@/components/Animation';
import { useAppCommon } from '@/hooks';

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

    return {
      isDigitalEdition
    };
  }
};
