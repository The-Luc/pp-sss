import { mapGetters } from 'vuex';

import ProcessItem from '../ProcessItem';
import MiniProcess from '@/components/MiniProcess';

import { GETTERS } from '@/store/modules/book/const';

const APPROVAL_DAYS = 10;

export default {
  components: {
    ProcessItem,
    MiniProcess
  },
  computed: {
    createdPosition() {
      return `${(this.getCreatedDateFromBeginning() /
        this.getTotalDayToShow()) *
        100}%`;
    },
    createdLength() {
      const diffDate =
        this.getReleaseDateFromBeginning() -
        this.getCreatedDateFromBeginning() +
        1;

      return `${(diffDate / this.getTotalDayToShow()) * 100}%`;
    },
    approvalLength() {
      return `${(APPROVAL_DAYS / this.getTotalDayToShow()) * 100}%`;
    },
    printLength() {
      const endDayOfApproval = this.getReleaseDateFromBeginning + APPROVAL_DAYS;

      const diffDate =
        this.getDeliveryDateFromBeginning() - endDayOfApproval + 1;

      return `${(diffDate / this.getTotalDayToShow()) * 100}%`;
    }
  },
  methods: {
    ...mapGetters({
      getTotalDayToShow: GETTERS.TOTAL_DAYS_SHOW_ON_CHART,
      getCreatedDateFromBeginning: GETTERS.CREATED_DAY_FROM_BEGINNING,
      getReleaseDateFromBeginning: GETTERS.RELEASE_DAY_FROM_BEGINNING,
      getDeliveryDateFromBeginning: GETTERS.DELIVERY_DAY_FROM_BEGINNING
    })
  }
};
