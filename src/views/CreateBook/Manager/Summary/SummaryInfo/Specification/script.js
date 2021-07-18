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
      return [
        this.getCoverOption(),
        this.getMaxPage(),
        this.getEstimatedQuantity(),
        this.getDeliveryOption()
      ];
    }
  },
  methods: {
    /**
     * Get display cover option
     *
     * @returns {Object}  display cover option of book
     */
    getCoverOption() {
      return getDisplayInfo('Cover Option', this.book?.coverOption);
    },
    /**
     * Get display max page
     *
     * @returns {Object}  display max page of book
     */
    getMaxPage() {
      return getDisplayInfo(
        'Number of Pages (maximum)',
        this.book?.numberMaxPages
      );
    },
    /**
     * Get display estimate quantity
     *
     * @returns {Object}  display estimate quantity of book
     */
    getEstimatedQuantity() {
      const quantity = this.book?.estimatedQuantity;

      const description = isEmpty(quantity)
        ? ''
        : `${quantity.min} - ${quantity.max}`;

      return getDisplayInfo('Estimated Quantity', description);
    },
    /**
     * Get display delivery option
     *
     * @returns {Object}  display delivery option of book
     */
    getDeliveryOption() {
      return getDisplayInfo('Delivery Option', this.book?.deliveryOption);
    }
  }
};
