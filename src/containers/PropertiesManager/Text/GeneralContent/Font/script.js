import PpSelect from '@/components/Select';
import FontSize from './Size';
import FontFamily from './Family';
import { FONT_SIZE } from '@/common/constants';

export default {
  components: {
    PpSelect,
    FontSize,
    FontFamily
  },
  data() {
    return {
      fontFamily: ['Arial', 'Time News Roman', 'Verdana', 'Georgia', 'Courier'],
      fontSize: FONT_SIZE
    };
  }
};
