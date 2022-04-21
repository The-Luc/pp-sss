import { mapGetters } from 'vuex';

import MiniProcess from '@/components/BarProcesses/MiniProcess';
import ProcessItem from '../ProcessItem';

import { GETTERS } from '@/store/modules/book/const';
import { APPROVAL_DAYS } from '@/common/constants';

export default {
  components: {
    ProcessItem,
    MiniProcess
  },
  computed: {
    ...mapGetters({
      totalDayToShow: GETTERS.TOTAL_DAYS_SHOW_ON_CHART,
      createdDateFromBeginning: GETTERS.CREATED_DATE_FROM_BEGINNING,
      releaseDateFromBeginning: GETTERS.RELEASE_DATE_FROM_BEGINNING,
      deliveryDateFromBeginning: GETTERS.DELIVERY_DATE_FROM_BEGINNING
    }),
    createdPosition() {
      return `${(this.createdDateFromBeginning / this.totalDayToShow) * 100}%`;
    },
    createdLength() {
      const diffDate =
        this.releaseDateFromBeginning - this.createdDateFromBeginning + 1;

      return `${(diffDate / this.totalDayToShow) * 100}%`;
    },
    approvalLength() {
      return `${(APPROVAL_DAYS / this.totalDayToShow) * 100}%`;
    },
    printLength() {
      const endDayOfApproval = this.releaseDateFromBeginning + APPROVAL_DAYS;

      const diffDate = this.deliveryDateFromBeginning - endDayOfApproval + 1;

      return `${(diffDate / this.totalDayToShow) * 100}%`;
    }
  }
};
