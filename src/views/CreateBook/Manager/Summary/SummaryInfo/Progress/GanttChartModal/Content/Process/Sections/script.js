import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/book/const';

import Section from './Section';

export default {
  components: {
    Section
  },
  computed: {
    sections() {
      const sections = this.getSections();

      const position = `${(this.getCreatedDateFromBeginning() /
        this.getTotalDayToShow()) *
        100}%`;

      const diffDate =
        this.getReleaseDateFromBeginning() -
        this.getCreatedDateFromBeginning() +
        1;

      const length = `${(diffDate / this.getTotalDayToShow()) * 100}%`;

      const sectionData = sections.map(s => {
        const { id, name, color, status, dueDate } = s;

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

      return sectionData;
    }
  },
  methods: {
    ...mapGetters({
      getSections: GETTERS.SECTIONS,
      getTotalDayToShow: GETTERS.TOTAL_DAYS_SHOW_ON_CHART,
      getCreatedDateFromBeginning: GETTERS.CREATED_DAY_FROM_BEGINNING,
      getReleaseDateFromBeginning: GETTERS.RELEASE_DAY_FROM_BEGINNING
    })
  }
};
