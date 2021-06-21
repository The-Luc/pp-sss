import { mapGetters } from 'vuex';

import ProcessItem from '../ProcessItem';
import MiniProcess from '@/components/BarProcesses/MiniProcess';

import { GETTERS } from '@/store/modules/book/const';

export default {
  components: {
    ProcessItem,
    MiniProcess
  },
  computed: {
    ...mapGetters({
      totalDayToShow: GETTERS.TOTAL_DAYS_SHOW_ON_CHART,
      saleDateFromBeginning: GETTERS.SALE_DATE_FROM_BEGINNING,
      releaseDateFromBeginning: GETTERS.RELEASE_DATE_FROM_BEGINNING
    }),
    preSalePosition() {
      return `${(this.saleDateFromBeginning / this.totalDayToShow) * 100}%`;
    },
    preSaleLength() {
      const diffDate =
        this.releaseDateFromBeginning - this.saleDateFromBeginning + 1;

      return `${(diffDate / this.totalDayToShow) * 100}%`;
    }
  }
};
