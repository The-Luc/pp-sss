import Header from './Header';
import SummaryInfo from './SummaryInfo';
import MappingSettings from './MappingSettings';

import { mapMutations, mapGetters } from 'vuex';

import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { useUser } from '@/hooks';
import { isAdmin } from '@/common/utils';

export default {
  components: {
    Header,
    SummaryInfo,
    MappingSettings
  },
  setup() {
    const { currentUser } = useUser();

    return { currentUser };
  },
  computed: {
    ...mapGetters({
      sectionSelected: GETTERS.SECTION_SELECTED
    }),
    isAdminUser() {
      return isAdmin(this.currentUser);
    }
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
