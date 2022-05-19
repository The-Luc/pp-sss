import Header from './Header';
import SummaryInfo from './SummaryInfo';
import MappingSettings from './MappingSettings';

import { mapMutations, mapGetters } from 'vuex';

import { GETTERS, MUTATES } from '@/store/modules/app/const';

export default {
  components: {
    Header,
    SummaryInfo,
    MappingSettings
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
  },
  mounted() {
    this.$root.$emit('summary', this.$refs.summary);
  }
};
