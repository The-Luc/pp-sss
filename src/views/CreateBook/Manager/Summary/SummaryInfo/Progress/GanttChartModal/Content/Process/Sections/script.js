import Section from './Section';

import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/book/const';

export default {
  components: {
    Section
  },
  computed: {
    ...mapGetters({
      originSections: GETTERS.SECTIONS,
      totalDayToShow: GETTERS.TOTAL_DAYS_SHOW_ON_CHART,
      createdDateFromBeginning: GETTERS.CREATED_DATE_FROM_BEGINNING,
      dueDateFromBeginning: GETTERS.DUE_DATE_FROM_BEGINNING
    }),
    sections() {
      const position = `${(this.createdDateFromBeginning /
        this.totalDayToShow) *
        100}%`;

      return this.originSections.map(s => {
        const { id, name, color, status, dueDate } = s;

        const diffDate =
          this.dueDateFromBeginning(dueDate) - this.createdDateFromBeginning;

        const length = `${(diffDate / this.totalDayToShow) * 100}%`;

        return {
          id,
          name,
          color,
          status,
          dueDate,
          position,
          length
        };
      });
    }
  }
};
