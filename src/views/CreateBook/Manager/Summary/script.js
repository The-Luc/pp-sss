import { mapMutations, mapGetters } from 'vuex';

import { GETTERS, MUTATES } from '@/store/modules/app/const';

export default {
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
      const targetClassList = document.getElementById('manager-summary')
        .classList;
      const sectionListClassList = document.getElementById(
        'manager-section-list'
      ).classList;

      if (targetClassList.contains('collapse')) {
        targetClassList.remove('collapse');
        sectionListClassList.remove('collapse');
      } else {
        targetClassList.add('collapse');
        sectionListClassList.add('collapse');
      }
    }
  }
};
