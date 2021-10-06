import Letter from './Letter';
import LineSpacing from './Line';
import Column from './Column';
import { LETTER_SPACING, LINE_SPACING } from '@/common/constants';

export default {
  components: {
    Letter,
    LineSpacing,
    Column
  },
  data() {
    return {
      letterSpacing: LETTER_SPACING,
      lineSpacing: LINE_SPACING
    };
  }
};
