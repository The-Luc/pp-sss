import Number from './Number';
import LineVertical from '../LineVertical';

import { BOOK_NUMBER_TYPE, SCREEN } from '@/common/constants/book';

export default {
  components: {
    Number,
    LineVertical
  },
  props: {
    numberInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      path: this.$route.path,
      bookNumberType: BOOK_NUMBER_TYPE,
      screen: SCREEN
    };
  },
  watch: {
    $route(to) {
      this.path = to.path;
    }
  }
};
