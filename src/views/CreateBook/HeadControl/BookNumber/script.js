import { BOOK_NUMBER_TYPE, SCREEN } from '@/common/constants/book';
import Number from './Number';
import LineVertical from '../LineVertical';

export default {
  components: {
    Number,
    LineVertical
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
