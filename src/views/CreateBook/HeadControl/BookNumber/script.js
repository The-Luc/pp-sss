import { mapGetters } from 'vuex';
import { BOOK_NUMBER_TYPE, SCREEN } from '@/common/constants/book';
import Number from './Number';
import LineVertical from '../LineVertical';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
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
  computed: {
    ...mapGetters({
      getTotalInfo: BOOK_GETTERS.GET_TOTAL_INFO
    })
  },
  watch: {
    $route(to) {
      this.path = to.path;
    }
  }
};
