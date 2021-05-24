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
    details() {
      const bookSold = {
        name: 'Books Sold:',
        description: this.book().booksSold
      };

      const fundraisingEarned = {
        name: 'Fundraising $ Earned:',
        description: `$${this.book().fundraisingEarned.toFixed(2)}`
      };

      return [bookSold, fundraisingEarned];
    }
  },
  methods: {
    ...mapGetters({
      book: GETTERS.BOOK_DETAIL
    })
  }
};
