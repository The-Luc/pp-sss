import { mapGetters } from 'vuex';
import { GETTERS } from '@/store/modules/book/const';
export default {
  computed: {
    ...mapGetters({
      book: GETTERS.BOOK_DETAIL,
      pageSelected: 'book/getPageSelected'
    }),
    isHardCover() {
      const { coverOption, sections } = this.book;
      return (
        coverOption === 'Hardcover' &&
        this.pageSelected === sections[0].sheets[0].id
      );
    }
  }
};
