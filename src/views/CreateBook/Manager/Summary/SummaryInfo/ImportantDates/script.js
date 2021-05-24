import { mapGetters } from 'vuex';
import moment from 'moment';

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
      const deliveryDate = {
        name: 'Requested Delivery Date:',
        description: moment(new Date(this.book().deliveryDate)).format(
          'MM/DD/YY'
        )
      };

      const releaseDate = moment(new Date(this.book().releaseDate));

      const dueDate = {
        name: 'File Release Due Date:',
        description: releaseDate.format('MM/DD/YY')
      };

      const remain = releaseDate.diff(moment(new Date()), 'days');

      const countdown = {
        name: 'Countdown:',
        description: `${remain < 0 ? 0 : remain} days remaining`,
        customClass: 'countdown'
      };

      return [deliveryDate, dueDate, countdown];
    }
  },
  methods: {
    ...mapGetters({
      book: GETTERS.BOOK_DETAIL
    })
  }
};
