import { mapGetters } from 'vuex';

import { SCREEN } from '@/common/constants/book';
import PpButton from '@/components/Button';
import LineVertical from '../LineVertical';
import { GETTERS } from '@/store/modules/book/const';
import { ROUTE_NAME } from '@/common/constants';

export default {
  components: {
    PpButton,
    LineVertical
  },
  data() {
    return {
      screen: SCREEN,
      routeName: ROUTE_NAME,
      path: this.$route.path
    };
  },
  watch: {
    $route(to) {
      this.path = to.path;
    }
  },
  computed: {
    ...mapGetters({
      bookId: GETTERS.BOOK_ID
    })
  },
  methods: {
    onChangeView(newView, routeName) {
      if (this.$route.name !== routeName) {
        this.$router.push(`/book/${this.bookId}${newView.toLowerCase()}`);
      }
    }
  }
};
