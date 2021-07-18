import Section from '../SummarySection';
import Detail from '../SummaryDetail';

import moment from 'moment';
import { mapGetters } from 'vuex';

import { getDisplayInfo, isEmpty } from '@/common/utils';

import { GETTERS } from '@/store/modules/book/const';
import { DATE_FORMAT } from '@/common/constants';

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
      return [this.getDeliveryDate(), this.getDueDate(), this.getRemain()];
    }
  },
  methods: {
    /**
     * Get display delivery date
     *
     * @returns {Object}  display delivery date of book
     */
    getDeliveryDate() {
      const theDate = this.book?.deliveryDate;

      const description = isEmpty(theDate)
        ? ''
        : moment(new Date(theDate)).format(DATE_FORMAT.BASE);

      return getDisplayInfo('Requested Delivery Date', description);
    },
    /**
     * Get display due date
     *
     * @returns {Object}  display due date of book
     */
    getDueDate() {
      const releaseDate = this.book?.releaseDate;

      const description = isEmpty(releaseDate)
        ? ''
        : moment(new Date(releaseDate)).format(DATE_FORMAT.BASE);

      return getDisplayInfo('Requested Delivery Date', description);
    },
    /**
     * Get display remain
     *
     * @returns {Object}  display remain of book
     */
    getRemain() {
      const name = 'Countdown';
      const customClass = 'countdown';

      const releaseDate = this.book?.releaseDate;

      if (isEmpty(releaseDate)) return getDisplayInfo(name, '0', customClass);

      const momentReleaseDate = moment(new Date(releaseDate));

      const remain = momentReleaseDate.diff(moment(new Date()), 'days');

      const description = `${remain < 0 ? 0 : remain} days remaining`;

      return getDisplayInfo(name, description, customClass);
    }
  }
};
