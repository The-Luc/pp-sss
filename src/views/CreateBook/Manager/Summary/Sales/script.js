import { mapGetters } from 'vuex';
import { GETTERS } from '@/store/modules/book/const';
export default {
  computed: {
    ...mapGetters({
      book: GETTERS.BOOK_DETAIL
    }),
    fundraisingEarned() {
      return this.book.fundraisingEarned.toFixed(2);
    }
  }
};
