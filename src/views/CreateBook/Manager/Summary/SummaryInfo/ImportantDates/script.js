import Section from '../SummarySection';
import Detail from '../SummaryDetail';

import { mapGetters } from 'vuex';
import moment from 'moment';

import { DATE_FORMAT } from '@/common/constants';
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
      const deliveryDate = {
        name: 'Requested Delivery Date:',
        description: moment(new Date(this.book.deliveryDate)).format(
          DATE_FORMAT.BASE
        )
      };

      const releaseDate = moment(new Date(this.book.releaseDate));

      const dueDate = {
        name: 'File Release Due Date:',
        description: releaseDate.format(DATE_FORMAT.BASE)
      };

      const remain = releaseDate.diff(moment(new Date()), 'days');

      const countdown = {
        name: 'Countdown:',
        description: `${remain < 0 ? 0 : remain} days remaining`,
        customClass: 'countdown'
      };

      return [deliveryDate, dueDate, countdown];
    }
  }
};
