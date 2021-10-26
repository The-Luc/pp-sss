import MiniProcess from '@/components/BarProcesses/MiniProcess';

import ProcessItem from '../ProcessItem';

import { useGanttChart } from '../../../composables';

export default {
  components: {
    ProcessItem,
    MiniProcess
  },
  setup() {
    const {
      totalDayToShow,
      saleDateFromBeginning,
      releaseDateFromBeginning
    } = useGanttChart();

    return { totalDayToShow, saleDateFromBeginning, releaseDateFromBeginning };
  },
  computed: {
    preSalePosition() {
      return `${(this.saleDateFromBeginning / this.totalDayToShow) * 100}%`;
    },
    preSaleLength() {
      const salePercent =
        (this.saleDateFromBeginning / this.totalDayToShow) * 100;

      const releaseInPercent =
        (this.releaseDateFromBeginning / this.totalDayToShow) * 100;

      return `${releaseInPercent - salePercent}%`;
    }
  }
};
