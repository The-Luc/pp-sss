import Header from './Header';
import ImportantDates from './ImportantDates';
import Specification from './Specification';
import Sales from './Sales';
import Progress from './Progress';
import { mapMutations, mapGetters } from 'vuex';

import { GETTERS, MUTATES } from '@/store/modules/app/const';

export default {
  components: {
    Header,
    ImportantDates,
    Specification,
    Sales,
    Progress
  },
  computed: {
    ...mapGetters({
      sectionSelected: GETTERS.SECTION_SELECTED
    })
  },
  methods: {
    ...mapMutations({
      setSectionSelected: MUTATES.SET_SELECTION_SELECTED
    }),
    toogleSummary() {
      if (this.sectionSelected) {
        this.setSectionSelected('');
      }
    }
  }
};
