import BlockBar from '@/components/BarProcesses/BlockBar';

import moment from 'moment';

import { useGanttChart } from '../../composables';

import { DATE_FORMAT } from '@/common/constants';
import { getWidthOfGanttTimeline } from '@/common/utils';

export default {
  components: {
    BlockBar
  },
  setup() {
    const { eventDates, totalDayToShow, totalMonthToShow } = useGanttChart();

    return { eventDates, totalDayToShow, totalMonthToShow };
  },
  computed: {
    months: function() {
      const { createdDate } = this.eventDates;

      return Array.from({ length: this.totalMonthToShow }, (_, index) => {
        const width = getWidthOfGanttTimeline(
          createdDate,
          index,
          this.totalDayToShow
        );

        return { isUseBorder: true, slotName: `slot${index}`, width };
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
