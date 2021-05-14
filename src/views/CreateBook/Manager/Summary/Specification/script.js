import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState('book', ['book']),
    coverOption() {
      return this.book.coverOption;
    },
    numberMaxPages() {
      return this.book.numberMaxPages;
    },
    deliveryOption() {
      return this.book.deliveryOption;
    },
    minEstimated() {
      return this.book.estimatedQuantity.min;
    },
    maxEstimated() {
      return this.book.estimatedQuantity.max;
    }
  }
};
