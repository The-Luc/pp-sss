import BlockBar from '@/components/BarProcesses/BlockBar';

import { useGanttChart } from '../../composables';

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

        return { isUseBorder: true, width };
      });
    }
  }
};
