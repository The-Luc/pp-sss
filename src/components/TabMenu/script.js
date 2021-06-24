import { mapGetters } from 'vuex';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';

export default {
  data() {
    return {
      defaultTab: 'general'
    };
  },
  computed: {
    ...mapGetters({
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES
    })
  },
  watch: {
    isOpenMenuProperties(val) {
      if (val) return;
      this.defaultTab = 'general';
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
