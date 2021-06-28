import { mapGetters } from 'vuex';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';

import TabMenu from '@/components/TabMenu';

export default {
  components: {
    TabMenu
  },
  computed: {
    ...mapGetters({
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES
    })
  },
  data() {
    return {
      tabDefault: 'general'
    };
  },
  watch: {
    isOpenMenuProperties(val) {
      if (val) return;
      this.tabDefault = 'general';
    }
  },
  methods: {
    /**
     * Emit event change tab with current data to parent
     */
    onChange(data) {
      this.$emit('change', data);
    }
  }
};
