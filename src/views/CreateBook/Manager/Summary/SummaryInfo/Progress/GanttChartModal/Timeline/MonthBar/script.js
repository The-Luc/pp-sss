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
    ...mapGetters({
      eventDates: GETTERS.BOOK_DATES,
      totalMonthToShow: GETTERS.TOTAL_MONTH_SHOW_ON_CHART
    }),
    months: function() {
      return Array.from({ length: this.totalMonthToShow }, (v, index) => {
        return {
          isUseBorder: true,
          slotName: `slot${index}`
        };
      });
    },
    slots: function() {
      const { createdDate } = this.eventDates;

      const slotData = Array.from(
        { length: this.totalMonthToShow },
        (v, index) => {
          const checkTime = moment(createdDate, DATE_FORMAT.BASE).add(
            index,
            'M'
          );

          const isShowName = index > 0 && index < this.totalMonthToShow;

          return {
            id: index,
            name: isShowName ? checkTime.format('MMM') : ''
          };
        }
      );

      return slotData.filter(s => s.name.length > 0);
    }
  }
};
