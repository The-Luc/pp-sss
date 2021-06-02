import { mapGetters } from 'vuex';

import BlockBar from '@/components/BlockBar';

import { GETTERS } from '@/store/modules/book/const';

export default {
  components: {
    BlockBar
  },
  computed: {
    months: function() {
      const totalMonthToShow = this.getTotalMonthToShow();

      return Array.from({ length: totalMonthToShow }, () => {
        return {
          isUseBorder: true
        };
      });
    }
  },
  methods: {
    ...mapGetters({
      getTotalMonthToShow: GETTERS.TOTAL_MONTH_SHOW_ON_CHART
    })
  }
};
