import Merchandising from './Merchandising';
import Sections from './Sections';
import Production from './Production';

import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/book/const';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    Merchandising,
    Sections,
    Production
  },
  computed: {
    ...mapGetters({
      eventDates: GETTERS.BOOK_DATES
    }),
    isSale() {
      return !isEmpty(this.eventDates?.saleDate || null);
    }
  }
};
