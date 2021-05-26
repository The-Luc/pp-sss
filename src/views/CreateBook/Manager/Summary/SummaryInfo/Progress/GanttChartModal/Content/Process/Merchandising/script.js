import { mapGetters } from 'vuex';

import ProcessItem from '../ProcessItem';
import MiniProcess from '@/components/MiniProcess';

import { GETTERS } from '@/store/modules/book/const';

export default {
  components: {
    ProcessItem,
    MiniProcess
  },
  computed: {
    preSalePosition() {
      return `${(this.getSaleDateFromBeginning() / this.getTotalDayToShow()) *
        100}%`;
    },
    preSaleLength() {
      const diffDate =
        this.getReleaseDateFromBeginning() -
        this.getSaleDateFromBeginning() +
        1;

      return `${(diffDate / this.getTotalDayToShow()) * 100}%`;
    }
  },
  methods: {
    ...mapGetters({
      getTotalDayToShow: GETTERS.TOTAL_DAYS_SHOW_ON_CHART,
      getSaleDateFromBeginning: GETTERS.SALE_DAY_FROM_BEGINNING,
      getReleaseDateFromBeginning: GETTERS.RELEASE_DAY_FROM_BEGINNING
    })
  }
};
