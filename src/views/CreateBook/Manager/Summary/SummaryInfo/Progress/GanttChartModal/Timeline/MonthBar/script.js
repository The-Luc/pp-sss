import BlockBar from '@/components/BlockBar';

import { mapGetters } from 'vuex';
import moment from 'moment';

import { DATE_FORMAT } from '@/common/constants';
import { GETTERS } from '@/store/modules/book/const';

export default {
  components: {
    BlockBar
  },
  computed: {
    months: function() {
      const totalMonthToShow = this.getTotalMonthToShow();

      return Array.from({ length: totalMonthToShow }, (v, index) => {
        return {
          isUseBorder: true,
          slotName: `slot${index}`
        };
      });
    },
    slots: function() {
      const totalMonthToShow = this.getTotalMonthToShow();

      const { createdDate } = this.getBookEventDates();

      const slotData = Array.from({ length: totalMonthToShow }, (v, index) => {
        const checkTime = moment(createdDate, DATE_FORMAT.BASE).add(index, 'M');

        const isShowName = index > 0 && index < totalMonthToShow;

        return {
          id: index,
          name: isShowName ? checkTime.format('MMM') : ''
        };
      });

      return slotData.filter(s => s.name.length > 0);
    }
  },
  methods: {
    ...mapGetters({
      getBookEventDates: GETTERS.BOOK_DATES,
      getTotalMonthToShow: GETTERS.TOTAL_MONTH_SHOW_ON_CHART
    })
  }
};
