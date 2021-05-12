import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState('book', ['book']),
    price() {
      return this.book.price.toFixed(2);
    }
  }
};
