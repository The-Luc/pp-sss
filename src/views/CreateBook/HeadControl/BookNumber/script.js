import { mapGetters } from 'vuex';
import { BOOK_NUMBER_TYPE, SCREEN } from '@/common/constants/book';
import Number from './Number';
import LineVertical from '../LineVertical';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
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
      info: APP_GETTERS.GENERAL_INFO
    })
  },
  watch: {
    $route(to) {
      this.path = to.path;
    }
  }
};
