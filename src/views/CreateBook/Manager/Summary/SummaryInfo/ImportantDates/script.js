import Section from '../SummarySection';
import Detail from '../SummaryDetail';

import moment from 'moment';

import { useSummaryInfo } from '@/views/CreateBook/Manager/composables';

import { getDisplayInfo, isEmpty } from '@/common/utils';

import { DATE_FORMAT } from '@/common/constants';

export default {
  components: {
    Section,
    Detail
  },
  computed: {
    details() {
      return [this.getDeliveryDate(), this.getDueDate(), this.getRemain()];
    }
  },
  setup() {
    const { importantDatesInfo } = useSummaryInfo();

    return { importantDatesInfo };
  },
  methods: {
    /**
     * Get display delivery date
     *
     * @returns {Object}  display delivery date of book
     */
    getDeliveryDate() {
      const theDate = this.importantDatesInfo?.deliveryDate;

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
      const releaseDate = this.importantDatesInfo?.releaseDate;

      const description = isEmpty(releaseDate)
        ? ''
        : moment(new Date(releaseDate)).format(DATE_FORMAT.BASE);

      return getDisplayInfo('File Release Due Date', description);
    },
    /**
     * Get display remain
     *
     * @returns {Object}  display remain of book
     */
    getRemain() {
      const name = 'Countdown';
      const customClass = 'countdown';

      const releaseDate = this.importantDatesInfo?.releaseDate;

      if (isEmpty(releaseDate)) return getDisplayInfo(name, '0', customClass);

      const momentReleaseDate = moment(new Date(releaseDate));

      const remain = momentReleaseDate.diff(moment(new Date()), 'days');

      const description = `${remain < 0 ? 0 : remain} days remaining`;

      return getDisplayInfo(name, description, customClass);
    }
  }
};
