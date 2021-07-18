import Section from '../SummarySection';
import Detail from '../SummaryDetail';

import { mapGetters } from 'vuex';

import { getDisplayInfo, isEmpty } from '@/common/utils';

import { GETTERS } from '@/store/modules/book/const';

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
      return [this.getBooksSold(), this.getFundraisingEarned()];
    }
  },
  methods: {
    /**
     * Get display books sold
     *
     * @returns {Object}  display books sold of book
     */
    getBooksSold() {
      return getDisplayInfo('Books Sold', this.book?.booksSold);
    },
    /**
     * Get display fundraising $ earn
     *
     * @returns {Object}  display fundraising $ earn of book
     */
    getFundraisingEarned() {
      const earn = this.book?.fundraisingEarned;

      const description = isEmpty(earn) ? '' : earn.toFixed(2);

      return getDisplayInfo('Fundraising $ Earned', `$${description}`);
    }
  }
};
