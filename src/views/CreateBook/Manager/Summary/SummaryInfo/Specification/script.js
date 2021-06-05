import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/book/const';

import Section from '../SummarySection';
import Detail from '../SummaryDetail';

export default {
  components: {
    Section,
    Detail
  },
  computed: {
    ...mapGetters({
      book: GETTERS.BOOK_DETAIL
    }),
    details() {
      const coverOption = {
        name: 'Cover Option:',
        description: this.book.coverOption
      };

      const numberMaxPages = {
        name: 'Number of Pages (maximum):',
        description: this.book.numberMaxPages
      };

      const estimatedQuantity = {
        name: 'Estimated Quantity:',
        description: `${this.book.estimatedQuantity.min} - ${this.book.estimatedQuantity.max}`
      };

      const deliveryOption = {
        name: 'Delivery Option:',
        description: this.book.deliveryOption
      };

      return [coverOption, numberMaxPages, estimatedQuantity, deliveryOption];
    }
  }
};
