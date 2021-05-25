import { mapGetters } from 'vuex';

import Merchandising from './Merchandising';
import Sections from './Sections';
import Production from './Production';

import { GETTERS } from '@/store/modules/book/const';

export default {
  components: {
    Merchandising,
    Sections,
    Production
  },
  computed: {
    isSale() {
      const { saleDate } = this.getBookEventDates();

      return !!saleDate;
    }
  },
  methods: {
    ...mapGetters({
      getBookEventDates: GETTERS.BOOK_DATES
    })
  }
};
