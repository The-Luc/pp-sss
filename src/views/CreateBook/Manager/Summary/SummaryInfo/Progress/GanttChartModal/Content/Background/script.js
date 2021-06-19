import { mapGetters } from 'vuex';

import BlockBar from '@/components/BarProcesses/BlockBar';

import { GETTERS } from '@/store/modules/book/const';

export default {
  components: {
    BlockBar
  },
  computed: {
    ...mapGetters({
      totalMonthToShow: GETTERS.TOTAL_MONTH_SHOW_ON_CHART
    }),
    months: function() {
      return Array.from({ length: this.totalMonthToShow }, () => {
        return {
          isUseBorder: true
        };
      });
    }
  }
};
