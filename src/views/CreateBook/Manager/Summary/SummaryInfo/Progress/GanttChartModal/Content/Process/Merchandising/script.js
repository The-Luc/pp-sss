import { mapGetters } from 'vuex';

import ProcessItem from '../ProcessItem';
import SaleProcess from './SaleProcess';

import { GETTERS } from '@/store/modules/book/const';

export default {
  components: {
    ProcessItem,
    SaleProcess
  },
  computed: {
    preSalePosition() {
      return `${(this.getSaleDateFromBeginning() / this.getTotalDayToShow()) *
        100}%`;
    },
    preSaleLength() {
      const salePosition =
        this.getSaleDateFromBeginning() / this.getTotalDayToShow();
      const releasePosistion =
        this.getReleaseDateFromBeginning() / this.getTotalDayToShow();

      return `${(releasePosistion - salePosition) * 100}%`;
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
