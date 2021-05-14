import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState('book', ['book']),
    booksSold() {
      return this.book.booksSold;
    },
    fundraisingEarned() {
      return this.book.fundraisingEarned.toFixed(2);
    }
  }
};
