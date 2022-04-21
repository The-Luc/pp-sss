import Section from '../SummarySection';
import Detail from '../SummaryDetail';

import { useSummaryInfo } from '@/views/CreateBook/Manager/composables';

import { getDisplayInfo, isEmpty } from '@/common/utils';

export default {
  components: {
    Section,
    Detail
  },
  setup() {
    const { saleInfo } = useSummaryInfo();

    return { saleInfo };
  },
  computed: {
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
      return getDisplayInfo('Books Sold', this.saleInfo?.booksSold);
    },
    /**
     * Get display fundraising $ earn
     *
     * @returns {Object}  display fundraising $ earn of book
     */
    getFundraisingEarned() {
      const earn = this.saleInfo?.fundraisingEarned;

      const description = isEmpty(earn) ? '' : earn.toFixed(2);

      return getDisplayInfo('Fundraising $ Earned', `$${description}`);
    }
  }
};
